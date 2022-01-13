# Integración EZ Proxy

## 1. Pasos para levantar en un entorno de desarrollo
</br>

### a. Variables de entorno

- Setear en tus variables de entorno **NOVE_ENV** como **development**
- Definir el puerto en las variables de entorno (si no lo hace tomará el puerto por defecto 3000)

    ```bash
    export NODE_ENV=development
    export PORT=3000
    ```

- o puede usar el archivo **.env** para setear sus variables de entorno

    ```properties
    NODE_ENV=development
    PORT=3000
    ```

### b. Archivo de configuración

- Tomar como base el archivo **sample.json** que está ubicado dentro de la carpeta de **config**

    ```json
    "database": {
        "database": "dbname",
        "user": "user",
        "password": "password",
        "server": "host",
        "port": 1433,
        "options": {
            "encrypt": false,
            "enableArithAbort": false
        }
    }
    ```

    ```json
    "domain_company": "gmail.com" -> Dominio corporativo
    ```

### c. Levantar el servidor

- Ejecutar el siguiente comando

    ```properties
    npm run dev
    ```

## 2. Pasos para levantar en un entorno de producción
</br>

### a. Variables de entorno

- Setear en tus variables de entorno **NOVE_ENV** como **production**
- Definir el puerto en las variables de entorno (si no lo hace tomará el puerto por defecto 3000)

    ```bash
    export NODE_ENV=production
    export PORT=3000
    ```

- o puede usar el archivo **.env** para setear sus variables de entorno

    ```properties
    NODE_ENV=production
    PORT=3000
    ```

### b. Archivo de configuración

- Tomar como base el archivo **sample.json** que está ubicado dentro de la carpeta de **config**

    ```json
    "domain_company": "gmail.com" -> Dominio corporativo
    ```

    ```json
    "database": {
        "database": "dbname",
        "user": "user",
        "password": "password",
        "server": "host",
        "port": 1433,
        "options": {
            "encrypt": false,
            "enableArithAbort": false
        }
    }
    ```

    ```json
    "provider": {
        "providerId": "idcomplex", -> ID con el que el proveedor generará su token
        "whitelist": ["https://www.google.com"] -> URL de producción del proveedor con el cual realizará peticiones a nuestras API's
    },
    ```
    
### c. Generación de certificados

- Esta medida se usa para cifrar el token (solo se usa los certificados en el entorno de producción)

    ```cmd
    mkdir certs
    cd certs
    openssl genrsa -out private.pem 3072
    openssl rsa -in private.pem -pubout -out public.pem
    ```
    
### d. Levantar el servidor

- Ejecutar los siguientes comandos

    ```cmd
    npm install --production --verbose
    npm start
    ```

## 3. Usando docker

- Configurar el proyecto con todo lo mencionado en el punto 2.

- Generar la imagen

    ```cmd
    docker build -t `image_name` .
    ```

- Crear el contenedor

    ```bash
    docker run -d -p `port_to_expose`:3000 --name `app_name` `image_name`
    ```    
