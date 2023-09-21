CREATE DATABASE mallCompass;
USE mallCompass;


CREATE TABLE usuarios(
		contrasena char(225),
		apellido char(50),
		nombre char(50),
		id_usuario integer NOT NULL AUTO_INCREMENT,
    rol char(25),
		correo char(50),
		telefono char(50),
		imagen char(225),
		fecha_nacimiento date,
		PRIMARY KEY (id_usuario)
);

CREATE TABLE centro_comercial(
		estado_cuenta char(25),
		nombreCC char(50),
		longitud char(255),
		latitud char(255),
		imagen char(255),
		telefonoCC char(50),
		correo char(50),
		id_centroComercial integer NOT NULL AUTO_INCREMENT,
		direccion char(225),
		PRIMARY KEY (id_centroComercial)
);

CREATE TABLE tiendas(
		id_tienda integer NOT NULL AUTO_INCREMENT,
		nombreTienda char(50),
		imagen char(255),
		telefono char(50),
		numeroLocal char(50),
		estado_cuenta char(25),
		categoriaTienda char(50),
		correo char(50),
		PRIMARY KEY (id_tienda)
);

CREATE TABLE Publicaciones(
		descripcion char(255),
    actividad char(25),
		id_post integer NOT NULL AUTO_INCREMENT,
    vigencia_inicio datetime,
    vigencia_final datetime,
		imagen char(255),
    likes integer,
		PRIMARY KEY (id_post)
);

CREATE TABLE promociones(
		descripcion char(255),
		id_promocion integer NOT NULL AUTO_INCREMENT,
    vigencia_inicio datetime,
    vigencia_final datetime,
    timer time,
    cantidad integer,
		imagen char(255),
		qr char(255),
    precio float,
		PRIMARY KEY (id_promocion)
);

CREATE TABLE productos(
    existencia integer,
		id_producto integer NOT NULL AUTO_INCREMENT,
		descripcion char(255),
    estado_producto char(25),
    categoria char(25),
    nombre char(50),
    precio float,
		imagen char(255),
		qr char(255),
		PRIMARY KEY (id_producto)
);


CREATE TABLE preferencias(
		id_gusto integer NOT NULL AUTO_INCREMENT,
    categoria char(25),
    descripcion char(25),
		PRIMARY KEY (id_gusto)
);

CREATE TABLE loginTokens(
		id integer NOT NULL AUTO_INCREMENT,
    token char(225),
    correo char(50),
		PRIMARY KEY (id)
);
/*------------------------------------------------------
--CREACION DE TABLAS DE RELACION
-- ------>relaciones de usuarios*/
CREATE TABLE rel_user_cc(
    id_usuario integer,
    id_centroComercial integer,
    PRIMARY KEY (id_usuario,id_centroComercial),
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario),
    FOREIGN KEY (id_centroComercial) REFERENCES centro_comercial(id_centroComercial)
);

CREATE TABLE rel_user_tienda(
    id_tienda integer,
    id_usuario integer,
    PRIMARY KEY (id_tienda,id_usuario),
    FOREIGN KEY (id_tienda) REFERENCES tiendas(id_tienda),
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario)
);

CREATE TABLE rel_user_preferencias(
    id_usuario integer,
    id_gusto integer,
    PRIMARY KEY (id_usuario,id_gusto),
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario),
    FOREIGN KEY (id_gusto) REFERENCES preferencias(id_gusto)
);

CREATE TABLE rel_user_productos(
    id_usuario integer,
    id_producto integer,
    PRIMARY KEY (id_usuario,id_producto),
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario),
    FOREIGN KEY (id_producto) REFERENCES productos(id_producto)
);

CREATE TABLE rel_user_promociones(
    id_usuario integer,
    id_promocion integer,
    PRIMARY KEY (id_usuario,id_promocion),
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario),
    FOREIGN KEY (id_promocion) REFERENCES promociones(id_promocion)
);


/*relaciones varias*/
CREATE TABLE rel_cc_tiendas(
    id_centroComercial integer,
    id_tienda integer,
    PRIMARY KEY (id_centroComercial,id_tienda),
    FOREIGN KEY (id_centroComercial) REFERENCES centro_comercial(id_centroComercial),
    FOREIGN KEY (id_tienda) REFERENCES tiendas(id_tienda)
);

CREATE TABLE rel_cc_publicaciones(
    id_post integer,
    id_centroComercial integer,
    categoria char(25),
    PRIMARY KEY (id_post,id_centroComercial),
    FOREIGN KEY (id_post) REFERENCES Publicaciones(id_post),
    FOREIGN KEY (id_centroComercial) REFERENCES centro_comercial(id_centroComercial)
);

CREATE TABLE rel_tiendas_publicaciones(
    id_post integer,
    id_tienda integer,
    categoria char(25),
    PRIMARY KEY (id_post,id_tienda),
    FOREIGN KEY (id_post) REFERENCES Publicaciones(id_post),
    FOREIGN KEY (id_tienda) REFERENCES tiendas(id_tienda)
);

CREATE TABLE rel_tiendas_promociones(
    id_tienda integer,
    id_promocion integer,
    categoria char(25),
    PRIMARY KEY (id_tienda,id_promocion),
    FOREIGN KEY (id_tienda) REFERENCES tiendas(id_tienda),
    FOREIGN KEY (id_promocion) REFERENCES promociones(id_promocion)
);

CREATE TABLE rel_tiendas_productos(
    id_tienda integer,
    id_producto integer,
    PRIMARY KEY (id_tienda,id_producto),
    FOREIGN KEY (id_tienda) REFERENCES tiendas(id_tienda),
    FOREIGN KEY (id_producto) REFERENCES productos(id_producto)
);