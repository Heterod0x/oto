import os
from pathlib import Path

from solders.pubkey import Pubkey
from solders.keypair import Keypair
from solana.rpc.async_api import AsyncClient
from anchorpy import Idl, Program, Context, Provider, Wallet

SOLANA_RPC_URL = os.getenv("SOLANA_RPC_URL")
ADMIN_KEYPAIR = Keypair.from_base58_string(os.getenv("OTO_ADMIN_PRIVATE_KEY"))
PROGRAM_ID = Pubkey.from_string("otoUzj3eLyJXSkB4DmfGR63eHBMQ9tqPHJaGX8ySSsY")
IDL_PATH = Path("app/lib/oto_idl.json")


def create_provider(admin: Keypair) -> Provider:
    client = AsyncClient(SOLANA_RPC_URL)
    return Provider(client, Wallet(admin))


def create_program_client(idl_path: Path) -> Program:
    with idl_path.open() as f:
        raw_idl = f.read()
    idl = Idl.from_json(raw_idl)
    provider = create_provider(ADMIN_KEYPAIR)
    return Program(idl, PROGRAM_ID, provider=provider)


def get_oto_pda(program_id: Pubkey) -> Pubkey:
    seeds = [b"oto"]
    return Pubkey.find_program_address(seeds, program_id)[0]


def get_user_pda(program_id: Pubkey, user_id: str) -> Pubkey:
    seeds = [b"user", user_id.encode()]
    return Pubkey.find_program_address(seeds, program_id)[0]


async def update_point(user_id: str, delta: int) -> None:
    async with create_program_client(IDL_PATH) as program:
        oto_pda = get_oto_pda(program.program_id)
        user_pda = get_user_pda(program.program_id, user_id)
        accounts = {
            "oto": oto_pda,
            "user": user_pda,
            "admin": ADMIN_KEYPAIR.pubkey(),
        }
        await program.rpc["update_point"](user_id, delta, ctx=Context(accounts=accounts))
