CREATE DATABASE db_eduaccess;
\c db_eduaccess;

CREATE TABLE IF NOT EXISTS public.asistencia
(
    id_asistencia serial NOT NULL,
    id_persona integer NOT NULL,
    fecha date NOT NULL DEFAULT CURRENT_DATE,
    hora_entrada time without time zone,
    hora_salida time without time zone,
    estado character varying(20) COLLATE pg_catalog."default",
    CONSTRAINT asistencia_pkey PRIMARY KEY (id_asistencia)
);

CREATE TABLE IF NOT EXISTS public.carrera
(
    id_carrera serial NOT NULL,
    nombre character varying(100) COLLATE pg_catalog."default" NOT NULL,
    descripcion text COLLATE pg_catalog."default",
    CONSTRAINT carrera_pkey PRIMARY KEY (id_carrera),
    CONSTRAINT carrera_nombre_key UNIQUE (nombre)
);

CREATE TABLE IF NOT EXISTS public.docente_materia_ficha
(
    id_docente_materia_ficha serial NOT NULL,
    id_persona integer NOT NULL,
    id_materia integer NOT NULL,
    id_ficha integer NOT NULL,
    CONSTRAINT docente_materia_ficha_pkey PRIMARY KEY (id_docente_materia_ficha),
    CONSTRAINT docente_materia_ficha_id_persona_id_materia_id_ficha_key UNIQUE (id_persona, id_materia, id_ficha)
);

CREATE TABLE IF NOT EXISTS public.estudiante_ficha
(
    id_estudiante_ficha serial NOT NULL,
    id_persona integer NOT NULL,
    id_ficha integer NOT NULL,
    CONSTRAINT estudiante_ficha_pkey PRIMARY KEY (id_estudiante_ficha),
    CONSTRAINT estudiante_ficha_id_persona_id_ficha_key UNIQUE (id_persona, id_ficha)
);

CREATE TABLE IF NOT EXISTS public.ficha
(
    id_ficha serial NOT NULL,
    numero_ficha character varying(20) COLLATE pg_catalog."default" NOT NULL,
    id_carrera integer NOT NULL,
    CONSTRAINT ficha_pkey PRIMARY KEY (id_ficha),
    CONSTRAINT ficha_numero_ficha_key UNIQUE (numero_ficha)
);

CREATE TABLE IF NOT EXISTS public.huella
(
    id_huella serial NOT NULL,
    id_persona integer NOT NULL,
    template bytea NOT NULL,
    fecha_registro timestamp without time zone DEFAULT now(),
    finger_slot smallint NOT NULL,
    CONSTRAINT huella_pkey PRIMARY KEY (id_huella),
    CONSTRAINT huella_unique_persona UNIQUE (id_persona),
    CONSTRAINT huella_unique_slot UNIQUE (finger_slot)
);

CREATE TABLE IF NOT EXISTS public.huella_map
(
    id_sensor integer NOT NULL,
    id_persona integer NOT NULL,
    fecha_registro timestamp without time zone DEFAULT now(),
    last_seen timestamp without time zone,
    CONSTRAINT huella_map_pkey PRIMARY KEY (id_sensor),
    CONSTRAINT huella_map_id_persona_key UNIQUE (id_persona)
);

CREATE TABLE IF NOT EXISTS public.materia
(
    id_materia serial NOT NULL,
    nombre character varying(100) COLLATE pg_catalog."default" NOT NULL,
    tipo character varying(20) COLLATE pg_catalog."default",
    CONSTRAINT materia_pkey PRIMARY KEY (id_materia),
    CONSTRAINT materia_nombre_key UNIQUE (nombre)
);

CREATE TABLE IF NOT EXISTS public.persona
(
    id_persona serial NOT NULL,
    documento character varying(20) COLLATE pg_catalog."default" NOT NULL,
    nombre character varying(100) COLLATE pg_catalog."default" NOT NULL,
    apellido character varying(100) COLLATE pg_catalog."default" NOT NULL,
    correo character varying(100) COLLATE pg_catalog."default",
    telefono character varying(20) COLLATE pg_catalog."default",
    id_rol integer NOT NULL,
    CONSTRAINT persona_pkey PRIMARY KEY (id_persona),
    CONSTRAINT persona_correo_key UNIQUE (correo),
    CONSTRAINT persona_documento_key UNIQUE (documento)
);

CREATE TABLE IF NOT EXISTS public.rol
(
    id_rol serial NOT NULL,
    nombre character varying(50) COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT rol_pkey PRIMARY KEY (id_rol),
    CONSTRAINT rol_nombre_key UNIQUE (nombre)
);

CREATE TABLE IF NOT EXISTS public.users
(
    id_user serial NOT NULL,
    correo character varying(50) COLLATE pg_catalog."default" NOT NULL,
    password character varying(255) COLLATE pg_catalog."default" NOT NULL,
    id_persona integer NOT NULL,
    estado boolean DEFAULT false,
    CONSTRAINT users_pkey PRIMARY KEY (id_user),
    CONSTRAINT users_correo_key UNIQUE (correo),
    CONSTRAINT users_id_persona_key UNIQUE (id_persona)
);

ALTER TABLE IF EXISTS public.asistencia
    ADD CONSTRAINT asistencia_id_persona_fkey FOREIGN KEY (id_persona)
    REFERENCES public.persona (id_persona) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION;


ALTER TABLE IF EXISTS public.docente_materia_ficha
    ADD CONSTRAINT docente_materia_ficha_id_ficha_fkey FOREIGN KEY (id_ficha)
    REFERENCES public.ficha (id_ficha) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION;


ALTER TABLE IF EXISTS public.docente_materia_ficha
    ADD CONSTRAINT docente_materia_ficha_id_materia_fkey FOREIGN KEY (id_materia)
    REFERENCES public.materia (id_materia) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION;


ALTER TABLE IF EXISTS public.docente_materia_ficha
    ADD CONSTRAINT docente_materia_ficha_id_persona_fkey FOREIGN KEY (id_persona)
    REFERENCES public.persona (id_persona) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION;


ALTER TABLE IF EXISTS public.estudiante_ficha
    ADD CONSTRAINT estudiante_ficha_id_ficha_fkey FOREIGN KEY (id_ficha)
    REFERENCES public.ficha (id_ficha) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION;


ALTER TABLE IF EXISTS public.estudiante_ficha
    ADD CONSTRAINT estudiante_ficha_id_persona_fkey FOREIGN KEY (id_persona)
    REFERENCES public.persona (id_persona) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION;


ALTER TABLE IF EXISTS public.ficha
    ADD CONSTRAINT ficha_id_carrera_fkey FOREIGN KEY (id_carrera)
    REFERENCES public.carrera (id_carrera) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION;


ALTER TABLE IF EXISTS public.huella
    ADD CONSTRAINT huella_id_persona_fkey FOREIGN KEY (id_persona)
    REFERENCES public.persona (id_persona) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE CASCADE;
CREATE INDEX IF NOT EXISTS huella_unique_persona
    ON public.huella(id_persona);


ALTER TABLE IF EXISTS public.huella_map
    ADD CONSTRAINT huella_map_id_persona_fkey FOREIGN KEY (id_persona)
    REFERENCES public.persona (id_persona) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE CASCADE;
CREATE INDEX IF NOT EXISTS huella_map_id_persona_key
    ON public.huella_map(id_persona);


ALTER TABLE IF EXISTS public.persona
    ADD CONSTRAINT persona_id_rol_fkey FOREIGN KEY (id_rol)
    REFERENCES public.rol (id_rol) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION;


ALTER TABLE IF EXISTS public.users
    ADD CONSTRAINT users_id_persona_fkey FOREIGN KEY (id_persona)
    REFERENCES public.persona (id_persona) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION;
CREATE INDEX IF NOT EXISTS users_id_persona_key
    ON public.users(id_persona);

-- Insercion de datos para pruebas
insert into rol (id_rol, nombre) values (1, 'directora');
insert into rol (id_rol, nombre) values (2, 'directivo');

insert into persona (id_persona, documento, nombre, apellido, correo, telefono, id_rol)
values (1, 113105025, 'Amii', 'Dot', 'adot0@webnode.com', 091214630, 1);

insert into persona (id_persona, documento, nombre, apellido, correo, telefono, id_rol)
values (2, 113105452, 'Binnie', 'Ponnsett', 'bponnsett1@quantcast.com', 104102781, 2);

insert into persona (id_persona, documento, nombre, apellido, correo, telefono, id_rol)
values (3, 071925376, 'Filberto', 'McDougald', 'fmcdougald2@rediff.com', 065502608, 1);

insert into persona (id_persona, documento, nombre, apellido, correo, telefono, id_rol)
values (4, 221270101, 'Milena', 'Royson', 'mroyson3@yolasite.com', 211574613, 2);

insert into persona (id_persona, documento, nombre, apellido, correo, telefono, id_rol)
values (5, 111323016, 'Izaak', 'Ritchings', 'iritchings4@webeden.co.uk', 091904270, 2);

insert into persona (id_persona, documento, nombre, apellido, correo, telefono, id_rol)
values (6, 122239843, 'Holly', 'Wincott', 'hwincott5@cdc.gov', 071905985, 1);

insert into persona (id_persona, documento, nombre, apellido, correo, telefono, id_rol)
values (7, 062003977, 'Cal', 'Edgecombe', 'cedgecombe6@friendfeed.com', 071924089, 2);

insert into persona (id_persona, documento, nombre, apellido, correo, telefono, id_rol)
values (8, 101101581, 'Aldric', 'Ludgrove', 'aludgrove7@discovery.com', 011100106, 2);

insert into persona (id_persona, documento, nombre, apellido, correo, telefono, id_rol)
values (9, 075911205, 'Berenice', 'Caunter', 'bcaunter8@bloglovin.com', 211070175, 2);

insert into persona (id_persona, documento, nombre, apellido, correo, telefono, id_rol)
values (10, 101206389, 'Joachim', 'Sadd', 'jsadd9@comsenz.com', 122243127, 1);
