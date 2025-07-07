from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional, Dict
import uuid
from datetime import datetime
from emergentintegrations.payments.stripe.checkout import StripeCheckout, CheckoutSessionResponse, CheckoutStatusResponse, CheckoutSessionRequest


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Stripe initialization
stripe_api_key = os.environ.get('STRIPE_API_KEY')
if not stripe_api_key:
    raise ValueError("STRIPE_API_KEY environment variable is required")
stripe_checkout = StripeCheckout(api_key=stripe_api_key)

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# Define Models
class StatusCheck(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class StatusCheckCreate(BaseModel):
    client_name: str

# Payment Models
class PaymentTransaction(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    user_type: str
    amount: float
    currency: str
    session_id: str
    payment_status: str  # "initiated", "paid", "failed", "expired"
    metadata: Optional[Dict[str, str]] = None
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class PaymentRequest(BaseModel):
    user_id: str
    user_type: str
    match_id: str
    origin_url: str

# Add your routes to the router instead of directly to app
@api_router.get("/")
async def root():
    return {"message": "Hello World"}

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.dict()
    status_obj = StatusCheck(**status_dict)
    _ = await db.status_checks.insert_one(status_obj.dict())
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    status_checks = await db.status_checks.find().to_list(1000)
    return [StatusCheck(**status_check) for status_check in status_checks]

# Payment endpoints
@api_router.post("/payments/checkout/session")
async def create_payment_session(payment_request: PaymentRequest):
    try:
        # Fixed amount of 70€ for connection fee
        amount = 70.0
        currency = "eur"
        
        # Build success and cancel URLs
        success_url = f"{payment_request.origin_url}/payment-success?session_id={{CHECKOUT_SESSION_ID}}"
        cancel_url = f"{payment_request.origin_url}/payment-cancel"
        
        # Create metadata
        metadata = {
            "user_id": payment_request.user_id,
            "user_type": payment_request.user_type,
            "match_id": payment_request.match_id,
            "source": "swipe_ton_pro_connection"
        }
        
        # Create checkout session request
        checkout_request = CheckoutSessionRequest(
            amount=amount,
            currency=currency,
            success_url=success_url,
            cancel_url=cancel_url,
            metadata=metadata
        )
        
        # Create Stripe checkout session
        session = await stripe_checkout.create_checkout_session(checkout_request)
        
        # Save payment transaction in database
        payment_transaction = PaymentTransaction(
            user_id=payment_request.user_id,
            user_type=payment_request.user_type,
            amount=amount,
            currency=currency,
            session_id=session.session_id,
            payment_status="initiated",
            metadata=metadata
        )
        
        await db.payment_transactions.insert_one(payment_transaction.dict())
        
        return {
            "checkout_url": session.url,
            "session_id": session.session_id
        }
        
    except Exception as e:
        logger.error(f"Error creating payment session: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to create payment session: {str(e)}")

@api_router.get("/payments/checkout/status/{session_id}")
async def check_payment_status(session_id: str):
    try:
        # Get payment status from Stripe
        checkout_status = await stripe_checkout.get_checkout_status(session_id)
        
        # Update payment transaction in database
        payment_transaction = await db.payment_transactions.find_one({"session_id": session_id})
        
        if payment_transaction:
            # Update payment status based on Stripe response
            new_status = "paid" if checkout_status.payment_status == "paid" else checkout_status.status
            
            await db.payment_transactions.update_one(
                {"session_id": session_id},
                {"$set": {"payment_status": new_status}}
            )
            
            # If payment is successful, update match status to unlock messaging
            if checkout_status.payment_status == "paid":
                match_id = payment_transaction.get("metadata", {}).get("match_id")
                if match_id:
                    await db.matches.update_one(
                        {"id": match_id},
                        {"$set": {"paymentCompleted": True, "messageUnlocked": True}}
                    )
        
        return {
            "session_id": session_id,
            "payment_status": checkout_status.payment_status,
            "status": checkout_status.status,
            "amount_total": checkout_status.amount_total,
            "currency": checkout_status.currency
        }
        
    except Exception as e:
        logger.error(f"Error checking payment status: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to check payment status: {str(e)}")

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
