# EVM Contract

2.  You need to create `.env` file & fillout these values

    ```bash
    cp .env.example .env
    ```

    ```txt
    PRIVATE_KEY=""
    BASESCAN_API_KEY=""
    ```

3.  install

    ```bash
    yarn
    ```

- ### **commands**

  - **compile**

    ```bash
    yarn compile
    ```

  - **test**

    ```bash
    yarn test
    ```

  - **deploy contract**

    ```bash
    yarn deploy:Lock --network baseSepolia
    ```

    ```bash
    yarn deploy:CoreAssetCollection --network baseSepolia
    ```

    ```bash
    yarn deploy:Oto --network baseSepolia
    ```

  - **verify contract**

    ```bash
    yarn verify chain-84532
    ```

  - **get chain info**

    ```bash
    yarn getChainInfo --network baseSepolia
    ```

  - **get balance**

    ```bash
    yarn getBalance --network baseSepolia
    ```

  - **callReadMethod**

    ```bash
    yarn callReadMethod --network baseSepolia
    ```

  - **calWriteMethod**

    ```bash
    yarn callWriteMethod --network baseSepolia
    ```

  - **claim**

    ```bash
    yarn oto:claim --user-id "user123" --amount 600 --network baseSepolia
    ```

  - **getUserInfo**

    ```bash
    yarn oto:getUserInfo --user-id "user123" --network baseSepolia
    ```

  - **getUsersByOwner**

    ```bash
    yarn oto:getUsersByOwner --network baseSepolia
    ```

  - **initializeUser**

    ```bash
    yarn oto:initUser --user-id "user123" --network baseSepolia
    ```

  - **updatePoint**

    ```bash
    yarn oto:updatePoint --user-id "user123" --points 600 --network baseSepolia
    ```
