# nextjs-auth-sample

## Install

1. `front/.env`の作成<br>
    ex.
    ```
    # Environment variables declared in this file are automatically made available to Prisma.
    # See the documentation for more detail: https://pris.ly/d/prisma-schema#accessing-environment-variables-from-the-schema

    # Prisma supports the native connection string format for PostgreSQL, MySQL, SQLite, SQL Server, MongoDB and CockroachDB.
    # See the documentation for all the connection string options: https://pris.ly/d/connection-strings

    DATABASE_URL="mysql://root:root@localhost:13306/database"
    ```
    `docker-compose.yml`に併せて作成する。<br>

1. `front/env/env.local.json`の作成<br>
    `front/env/env.local.json.sample`を参考に作成する。<br>

1. MySQLコンテナのビルド及び実行<br>
    `$ docker-compose up --build`<br>

1. フロントエンドアプリケーションの準備<br>
    ```
    $ cd ./next
    ```
    <br>
    
    1. 依存パッケージのインストール<br>
        ```
        $ yarn install
        ```
    1. マイグレーション<br>
        ```
        $ npx prisma migrate dev
        $ npx prisma generate
        ```
    1. シーダー実行<br>
        ```
        $ npx prisma db seed
        ```
        成功した場合に以下が表示される。
        ```
        Environment variables loaded from .env
        Running seed command `ts-node --compiler-options {"module":"CommonJS"} prisma/seeder/user_seeder.ts` ...

        The seed command has been executed.
        ```

1. フロントエンドアプリケーションの実行<br>
    ```
    $ yarn dev
    ```
    <br>