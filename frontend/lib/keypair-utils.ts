import { PublicKey } from '@solana/web3.js';

/**
 * 環境変数から読み込んだ秘密鍵の配列をUint8Arrayに変換する
 * @param secretKeyString カンマ区切りの秘密鍵配列を表す文字列
 * @returns Uint8Array形式の秘密鍵
 */
export function parseSecretKey(secretKeyString: string): Uint8Array {
  try {
    // カンマ区切りの文字列を数値配列に変換
    const secretKeyArray = secretKeyString
      .split(',')
      .map(num => parseInt(num.trim(), 10));
    
    // 数値配列をUint8Arrayに変換
    return new Uint8Array(secretKeyArray);
  } catch (error) {
    console.error('秘密鍵の解析に失敗しました:', error);
    throw new Error('Invalid secret key format');
  }
}

/**
 * 環境変数からアセットキーペア情報を取得する
 * @returns アセットキーペア情報（publicKeyとsecretKey）
 */
export function getAssetKeypair(): { publicKey: string; secretKey: Uint8Array } {
  // 環境変数からキーペア情報を取得
  const publicKey = process.env.NEXT_PUBLIC_ASSET_PUBLIC_KEY;
  const secretKeyString = process.env.ASSET_SECRET_KEY;

  if (!publicKey || !secretKeyString) {
    throw new Error('Asset keypair environment variables are not set');
  }

  // 秘密鍵を解析してUint8Arrayに変換
  const secretKey = parseSecretKey(secretKeyString);

  return {
    publicKey,
    secretKey
  };
}

/**
 * 環境変数からアセットPublicKeyオブジェクトを取得する
 * @returns PublicKeyオブジェクト
 */
export function getAssetPublicKey(): PublicKey {
  const publicKeyString = process.env.NEXT_PUBLIC_ASSET_PUBLIC_KEY;
  
  if (!publicKeyString) {
    throw new Error('Asset public key environment variable is not set');
  }

  return new PublicKey(publicKeyString);
}