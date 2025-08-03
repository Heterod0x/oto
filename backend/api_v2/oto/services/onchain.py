from functools import lru_cache
from solana.rpc.async_api import AsyncClient
from solana.rpc.commitment import Processed
from solders.transaction import Transaction
import base64
from solders.keypair import Keypair
from oto.environment import get_settings
from construct import Struct, Bytes, Int64ul

CLAIM_LAYOUT = Struct(
    "DISCRIMINATOR" / Bytes(8),
    "AMOUNT" / Int64ul,
)


class ClaimRequest:
    tx: Transaction
    amount: int


@lru_cache
def get_onchain_service() -> "OnchainService":
    return OnchainService(get_settings().solana_keypair, get_settings().solana_rpc_url)


class OnchainService:
    def __init__(self, keypair: str, rpc_url: str):
        self.keypair = Keypair.from_base58_string(keypair)
        self.rpc_url = rpc_url

    def parse_claim_tx(self, tx_base64: str) -> ClaimRequest:
        tx = Transaction.from_bytes(base64.b64decode(tx_base64))
        parsed = CLAIM_LAYOUT.parse(tx.message.instructions[0].data)
        claim_discriminator = [78, 159, 1, 127, 25, 98, 109, 135]
        assert len(parsed.DISCRIMINATOR) == len(claim_discriminator)
        for i in range(len(claim_discriminator)):
            assert parsed.DISCRIMINATOR[i] == claim_discriminator[i]
        req = ClaimRequest()
        req.tx = tx
        req.amount = parsed.AMOUNT
        return req

    def sign(self, tx: Transaction) -> Transaction:
        tx.partial_sign([self.keypair], tx.message.recent_blockhash)
        return tx

    async def send_tx(self, tx: Transaction) -> str:
        async with AsyncClient(self.rpc_url) as client:
            response = await client.send_transaction(tx)
            await client.confirm_transaction(response.value, Processed)
            return str(response.value)
