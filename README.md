# Integración: Hub Información UC - Elogim

</br>

### a. Variables de entorno

- Establecer las variables de entorno, _archivo de referencia: **.env.sample**_
- Definir el puerto en las variables de entorno (si no lo hace tomará el puerto por defecto 3000)

```env
# server
PORT=3010

# JSON Web Token
SECRET_KEY=''

# Base de datos
DB_NAME=''
DB_USER=''
DB_PASSWORD=''
DB_HOST=''
DB_PORT=''

# proveedor Elogim
ELOGIM_PROVIDER_ID=''
```
### b. Levantar el servidor

- Modo Dev

```properties
$~ npm install
$~ npm run dev
```

- Modo Prod

```properties
$~ npm install --production
$~ npm start
```

