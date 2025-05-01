/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/oto.json`.
 */
export type Oto = {
  address: "otoUzj3eLyJXSkB4DmfGR63eHBMQ9tqPHJaGX8ySSsY";
  metadata: {
    name: "oto";
    version: "0.1.0";
    spec: "0.1.0";
    description: "Created with Anchor";
  };
  instructions: [
    {
      name: "claim";
      discriminator: [62, 198, 214, 193, 213, 159, 108, 210];
      accounts: [
        {
          name: "oto";
          pda: {
            seeds: [
              {
                kind: "const";
                value: [111, 116, 111];
              },
            ];
          };
        },
        {
          name: "user";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [117, 115, 101, 114];
              },
              {
                kind: "arg";
                path: "userId";
              },
            ];
          };
        },
        {
          name: "beneficiary";
          writable: true;
          signer: true;
        },
        {
          name: "userTokenAccount";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "account";
                path: "beneficiary";
              },
              {
                kind: "account";
                path: "tokenProgram";
              },
              {
                kind: "account";
                path: "mint";
              },
            ];
            program: {
              kind: "const";
              value: [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89,
              ];
            };
          };
        },
        {
          name: "mint";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [109, 105, 110, 116];
              },
            ];
          };
          relations: ["oto"];
        },
        {
          name: "tokenProgram";
        },
        {
          name: "associatedTokenProgram";
          address: "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL";
        },
        {
          name: "systemProgram";
          address: "11111111111111111111111111111111";
        },
      ];
      args: [
        {
          name: "userId";
          type: "string";
        },
        {
          name: "claimAmount";
          type: "u64";
        },
      ];
    },
    {
      name: "initializeOto";
      discriminator: [9, 66, 201, 112, 210, 40, 68, 39];
      accounts: [
        {
          name: "oto";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [111, 116, 111];
              },
            ];
          };
        },
        {
          name: "payer";
          writable: true;
          signer: true;
        },
        {
          name: "mint";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [109, 105, 110, 116];
              },
            ];
          };
        },
        {
          name: "metadata";
          writable: true;
        },
        {
          name: "nftCollection";
        },
        {
          name: "systemProgram";
          address: "11111111111111111111111111111111";
        },
        {
          name: "rent";
          address: "SysvarRent111111111111111111111111111111111";
        },
        {
          name: "tokenMetadataProgram";
          address: "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s";
        },
        {
          name: "tokenProgram";
        },
      ];
      args: [];
    },
    {
      name: "initializeUser";
      discriminator: [111, 17, 185, 250, 60, 122, 38, 254];
      accounts: [
        {
          name: "oto";
          pda: {
            seeds: [
              {
                kind: "const";
                value: [111, 116, 111];
              },
            ];
          };
        },
        {
          name: "user";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [117, 115, 101, 114];
              },
              {
                kind: "arg";
                path: "userId";
              },
            ];
          };
        },
        {
          name: "payer";
          writable: true;
          signer: true;
        },
        {
          name: "systemProgram";
          address: "11111111111111111111111111111111";
        },
      ];
      args: [
        {
          name: "userId";
          type: "string";
        },
        {
          name: "owner";
          type: "pubkey";
        },
      ];
    },
    {
      name: "updatePoint";
      discriminator: [89, 158, 247, 64, 0, 100, 210, 82];
      accounts: [
        {
          name: "oto";
          pda: {
            seeds: [
              {
                kind: "const";
                value: [111, 116, 111];
              },
            ];
          };
        },
        {
          name: "user";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [117, 115, 101, 114];
              },
              {
                kind: "arg";
                path: "userId";
              },
            ];
          };
        },
        {
          name: "admin";
          writable: true;
          signer: true;
          relations: ["oto"];
        },
      ];
      args: [
        {
          name: "userId";
          type: "string";
        },
        {
          name: "delta";
          type: "u64";
        },
      ];
    },
  ];
  accounts: [
    {
      name: "baseCollectionV1";
      discriminator: [0, 0, 0, 0, 0, 0, 0, 0];
    },
    {
      name: "oto";
      discriminator: [11, 237, 61, 97, 3, 132, 38, 13];
    },
    {
      name: "user";
      discriminator: [159, 117, 95, 227, 239, 151, 58, 236];
    },
  ];
  errors: [
    {
      code: 6000;
      name: "notEnoughClaimableAmount";
      msg: "Not enough claimable amount";
    },
    {
      code: 6001;
      name: "overflow";
      msg: "overflow";
    },
  ];
  types: [
    {
      name: "baseCollectionV1";
      type: {
        kind: "struct";
        fields: [
          {
            name: "key";
            type: {
              defined: {
                name: "key";
              };
            };
          },
          {
            name: "updateAuthority";
            type: "pubkey";
          },
          {
            name: "name";
            type: "string";
          },
          {
            name: "uri";
            type: "string";
          },
          {
            name: "numMinted";
            type: "u32";
          },
          {
            name: "currentSize";
            type: "u32";
          },
        ];
      };
    },
    {
      name: "key";
      type: {
        kind: "enum";
        variants: [
          {
            name: "uninitialized";
          },
          {
            name: "assetV1";
          },
          {
            name: "hashedAssetV1";
          },
          {
            name: "pluginHeaderV1";
          },
          {
            name: "pluginRegistryV1";
          },
          {
            name: "collectionV1";
          },
        ];
      };
    },
    {
      name: "oto";
      type: {
        kind: "struct";
        fields: [
          {
            name: "admin";
            type: "pubkey";
          },
          {
            name: "mint";
            type: "pubkey";
          },
          {
            name: "nftCollection";
            type: "pubkey";
          },
          {
            name: "bump";
            type: "u8";
          },
        ];
      };
    },
    {
      name: "user";
      type: {
        kind: "struct";
        fields: [
          {
            name: "userId";
            type: "string";
          },
          {
            name: "claimableAmount";
            type: "u64";
          },
          {
            name: "owner";
            type: "pubkey";
          },
          {
            name: "bump";
            type: "u8";
          },
        ];
      };
    },
  ];
};
