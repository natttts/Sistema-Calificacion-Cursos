CREATE DATABASE sistema_calificacion;
USE sistema_calificacion;

CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    registro_academico VARCHAR(20) NOT NULL,
    nombres VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    correo VARCHAR(150) NOT NULL,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE cursos (
id INT AUTO_INCREMENT PRIMARY KEY,
nombre VARCHAR(100) NOT NULL,
creditos INT NOT NULL
);

CREATE TABLE catedraticos (
id INT AUTO_INCREMENT PRIMARY KEY,
nombre VARCHAR(100) NOT NULL
);

CREATE TABLE curso_catedratico (
id_curso INT NOT NULL,
id_catedratico INT NOT NULL,
PRIMARY KEY (id_curso, id_catedratico),
FOREIGN KEY (id_curso) REFERENCES cursos(id),
FOREIGN KEY (id_catedratico) REFERENCES catedraticos(id)
);

CREATE TABLE publicaciones (
id INT AUTO_INCREMENT PRIMARY KEY,
id_usuario INT NOT NULL,
id_curso INT,
id_catedratico INT,
contedio TEXT NOT NULL,
fecha_hora DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
FOREIGN KEY (id_usuario) REFERENCES usuarios(id),
FOREIGN KEY (id_curso) REFERENCES cursos(id),
FOREIGN KEY (id_catedratico) REFERENCES catedraticos(id)
);

CREATE TABLE comentarios(
id INT AUTO_INCREMENT PRIMARY KEY,
id_publicacion INT NOT NULL,
id_usuario INT NOT NULL ,
contenido TEXT NOT NULL,
fecha_hora DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
FOREIGN KEY (id_publicacion) REFERENCES publicaciones(id),
FOREIGN KEY (id_usuario) REFERENCES usuarios(id)
);

CREATE TABLE cursos_aprobados(
id_usuario INT NOT NULL,
id_curso INT NOT NULL,
PRIMARY KEY (id_usuario, id_curso),
FOREIGN KEY (id_usuario) REFERENCES usuarios(id),
FOREIGN KEY (id_curso) REFERENCES cursos(id)
);


