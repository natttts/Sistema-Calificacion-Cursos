import { useState } from 'react'
import './App.css'

function App() {
  const [vista, setVista] = useState('login')
  const [usuario, setUsuario] = useState(null)

  // LOGIN Y REGISTRO
  const [registroAcademico, setRegistroAcademico] = useState('')
  const [password, setPassword] = useState('')
  const [nombres, setNombres] = useState('')
  const [apellidos, setApellidos] = useState('')
  const [correo, setCorreo] = useState('')

  // RECUPERAR CONTRASEÑA
  const [recuperarRegistro, setRecuperarRegistro] = useState('')
  const [recuperarCorreo, setRecuperarCorreo] = useState('')
  const [nuevaPassword, setNuevaPassword] = useState('')

  // PUBLICACIONES
  const [contenido, setContenido] = useState('')
  const [idCurso, setIdCurso] = useState('')
  const [idCatedratico, setIdCatedratico] = useState('')
  const [publicaciones, setPublicaciones] = useState([])

  // CURSOS Y CATEDRÁTICOS
  const [cursos, setCursos] = useState([])
  const [catedraticos, setCatedraticos] = useState([])

  // PERFILES
  const [registroBusqueda, setRegistroBusqueda] = useState('')
  const [perfil, setPerfil] = useState(null)
  const [idCursoAprobado, setIdCursoAprobado] = useState('')

  // EDITAR PERFIL
  const [editarNombres, setEditarNombres] = useState('')
  const [editarApellidos, setEditarApellidos] = useState('')
  const [editarCorreo, setEditarCorreo] = useState('')
  const [editarPassword, setEditarPassword] = useState('')

  // COMENTARIOS
  const [comentarios, setComentarios] = useState({})
  const [nuevoComentario, setNuevoComentario] = useState({})
  const [mensajesComentario, setMensajesComentario] = useState({})

  const [mensaje, setMensaje] = useState('')

  // =========================
  // INICIAR SESIÓN
  // =========================

  const iniciarSesion = async (e) => {
    e.preventDefault()
    setMensaje('')

    try {
      const respuesta = await fetch(
        'http://localhost:3000/api/usuarios/login',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            registro_academico: registroAcademico,
            password: password,
          }),
        }
      )

      const datos = await respuesta.json()

      if (respuesta.ok) {
        setUsuario(datos.usuario)

        setRegistroAcademico('')
        setPassword('')
        setMensaje('')

        await obtenerPublicaciones()

        setVista('home')
      } else {
        setMensaje(datos.mensaje)
      }
    } catch (error) {
      console.error(error)
      setMensaje('No se pudo conectar con el servidor')
    }
  }

  // =========================
  // REGISTRAR USUARIO
  // =========================

  const registrarUsuario = async (e) => {
    e.preventDefault()
    setMensaje('')

    try {
      const respuesta = await fetch(
        'http://localhost:3000/api/usuarios/registro',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            registro_academico: registroAcademico,
            nombres: nombres,
            apellidos: apellidos,
            correo: correo,
            password: password,
          }),
        }
      )

      const datos = await respuesta.json()

      if (respuesta.ok) {
        setMensaje('Usuario registrado correctamente')

        setRegistroAcademico('')
        setNombres('')
        setApellidos('')
        setCorreo('')
        setPassword('')

        setTimeout(() => {
          setVista('login')
          setMensaje('')
        }, 1500)
      } else {
        setMensaje(datos.mensaje)
      }
    } catch (error) {
      console.error(error)
      setMensaje('No se pudo conectar con el servidor')
    }
  }

  // =========================
  // RECUPERAR CONTRASEÑA
  // =========================

  const recuperarContrasena = async (e) => {
    e.preventDefault()
    setMensaje('')

    if (
      !recuperarRegistro.trim() ||
      !recuperarCorreo.trim() ||
      !nuevaPassword.trim()
    ) {
      setMensaje('Todos los campos son obligatorios')
      return
    }

    try {
      const respuesta = await fetch(
        'http://localhost:3000/api/usuarios/recuperar',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            registro_academico: recuperarRegistro,
            correo: recuperarCorreo,
            nueva_password: nuevaPassword,
          }),
        }
      )

      const datos = await respuesta.json()

      if (respuesta.ok) {
        setMensaje('Contraseña actualizada correctamente')
        setRecuperarRegistro('')
        setRecuperarCorreo('')
        setNuevaPassword('')

        setTimeout(() => {
          setMensaje('')
          setVista('login')
        }, 1500)
      } else {
        setMensaje(datos.mensaje || 'No se pudo actualizar la contraseña')
      }
    } catch (error) {
      console.error(error)
      setMensaje('No se pudo conectar con el servidor')
    }
  }

  // =========================
  // OBTENER PUBLICACIONES
  // =========================

  const obtenerPublicaciones = async (mostrarMensaje = false) => {
    try {
      const respuesta = await fetch(
        'http://localhost:3000/api/publicaciones'
      )

      const datos = await respuesta.json()

      if (respuesta.ok) {
        setPublicaciones(datos)
        await cargarComentarios(datos)

        if (mostrarMensaje) {
          setMensaje('Publicaciones y comentarios actualizados correctamente')

          setTimeout(() => {
            setMensaje('')
          }, 2000)
        }
      } else if (mostrarMensaje) {
        setMensaje('No se pudieron actualizar las publicaciones')
      }
    } catch (error) {
      console.error('Error al obtener publicaciones:', error)

      if (mostrarMensaje) {
        setMensaje('Error al actualizar publicaciones')
      }
    }
  }

  // =========================
  // OBTENER CURSOS
  // =========================

  const obtenerCursos = async () => {
    try {
      const respuesta = await fetch(
        'http://localhost:3000/api/cursos'
      )

      const datos = await respuesta.json()

      if (respuesta.ok) {
        setCursos(datos)
      }
    } catch (error) {
      console.error('Error al obtener cursos:', error)
    }
  }

  // =========================
  // OBTENER CATEDRÁTICOS
  // =========================

  const obtenerCatedraticos = async () => {
    try {
      const respuesta = await fetch(
        'http://localhost:3000/api/catedraticos'
      )

      const datos = await respuesta.json()

      if (respuesta.ok) {
        setCatedraticos(datos)
      }
    } catch (error) {
      console.error('Error al obtener catedráticos:', error)
    }
  }

  // =========================
  // ABRIR CREAR PUBLICACIÓN
  // =========================

  const abrirCrearPublicacion = async () => {
    setMensaje('')
    setIdCurso('')
    setIdCatedratico('')
    setContenido('')

    await obtenerCursos()
    await obtenerCatedraticos()

    setVista('crear-publicacion')
  }

  // =========================
  // CREAR PUBLICACIÓN
  // =========================

  const crearPublicacion = async (e) => {
    e.preventDefault()
    setMensaje('')

    if (!idCurso && !idCatedratico) {
      setMensaje('Debes seleccionar un curso o un catedrático')
      return
    }

    if (!contenido.trim()) {
      setMensaje('Debes escribir el contenido de la publicación')
      return
    }

    try {
      const respuesta = await fetch(
        'http://localhost:3000/api/publicaciones',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id_usuario: usuario.id,
            id_curso: idCurso || null,
            id_catedratico: idCatedratico || null,
            contenido: contenido,
          }),
        }
      )

      const datos = await respuesta.json()

      if (respuesta.ok) {
        setContenido('')
        setIdCurso('')
        setIdCatedratico('')
        setMensaje('')

        await obtenerPublicaciones()

        setVista('home')
      } else {
        setMensaje(datos.mensaje)
      }
    } catch (error) {
      console.error(error)
      setMensaje('No se pudo crear la publicación')
    }
  }

  // =========================
  // ABRIR BUSCAR PERFIL
  // =========================

  const abrirBuscarPerfil = () => {
    setRegistroBusqueda('')
    setPerfil(null)
    setMensaje('')
    setVista('buscar-perfil')
  }

  // =========================
  // BUSCAR PERFIL
  // =========================

  const buscarPerfil = async (e) => {
    e.preventDefault()

    setMensaje('')
    setPerfil(null)

    if (!registroBusqueda.trim()) {
      setMensaje('Ingresa un registro académico')
      return
    }

    try {
      const respuesta = await fetch(
        `http://localhost:3000/api/usuarios/perfil/${registroBusqueda}`
      )

      const datos = await respuesta.json()

      if (respuesta.ok) {
        setPerfil(datos)
      } else {
        setMensaje(datos.mensaje)
      }
    } catch (error) {
      console.error(error)
      setMensaje('No se pudo buscar el perfil')
    }
  }

  // =========================
  // MI PERFIL
  // =========================

  const cargarMiPerfil = async () => {
    try {
      const respuesta = await fetch(
        `http://localhost:3000/api/usuarios/perfil/${usuario.registro_academico}`
      )

      const datos = await respuesta.json()

      if (respuesta.ok) {
        setPerfil(datos)
        return true
      }

      setMensaje(datos.mensaje || 'No se pudo cargar el perfil')
      return false
    } catch (error) {
      console.error(error)
      setMensaje('No se pudo cargar el perfil')
      return false
    }
  }

  const abrirMiPerfil = async () => {
    setMensaje('')
    setPerfil(null)
    setIdCursoAprobado('')

    await obtenerCursos()

    const cargado = await cargarMiPerfil()

    if (cargado) {
      setVista('mi-perfil')
    }
  }

  const agregarCursoAprobado = async (e) => {
    e.preventDefault()
    setMensaje('')

    if (!idCursoAprobado) {
      setMensaje('Selecciona un curso')
      return
    }

    try {
      const respuesta = await fetch(
        `http://localhost:3000/api/usuarios/${usuario.id}/cursos-aprobados`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id_curso: idCursoAprobado,
          }),
        }
      )

      const datos = await respuesta.json()

      if (respuesta.ok) {
        setIdCursoAprobado('')
        await cargarMiPerfil()
        setMensaje('Curso aprobado agregado correctamente')
      } else {
        setMensaje(datos.mensaje || 'No se pudo agregar el curso')
      }
    } catch (error) {
      console.error(error)
      setMensaje('No se pudo agregar el curso')
    }
  }

  const eliminarCursoAprobado = async (idCursoEliminar) => {
    setMensaje('')

    try {
      const respuesta = await fetch(
        `http://localhost:3000/api/usuarios/${usuario.id}/cursos-aprobados/${idCursoEliminar}`,
        {
          method: 'DELETE',
        }
      )

      const datos = await respuesta.json()

      if (respuesta.ok) {
        await cargarMiPerfil()
        setMensaje('Curso aprobado eliminado correctamente')
      } else {
        setMensaje(datos.mensaje || 'No se pudo eliminar el curso')
      }
    } catch (error) {
      console.error(error)
      setMensaje('No se pudo eliminar el curso')
    }
  }

  // =========================
  // EDITAR PERFIL
  // =========================

  const abrirEditarPerfil = () => {
    setMensaje('')
    setEditarNombres(perfil.usuario.nombres)
    setEditarApellidos(perfil.usuario.apellidos)
    setEditarCorreo(perfil.usuario.correo)
    setEditarPassword('')
    setVista('editar-perfil')
  }

  const guardarCambiosPerfil = async (e) => {
    e.preventDefault()
    setMensaje('')

    if (
      !editarNombres.trim() ||
      !editarApellidos.trim() ||
      !editarCorreo.trim() ||
      !editarPassword.trim()
    ) {
      setMensaje('Todos los campos son obligatorios')
      return
    }

    try {
      const respuesta = await fetch(
        `http://localhost:3000/api/usuarios/${usuario.id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            nombres: editarNombres,
            apellidos: editarApellidos,
            correo: editarCorreo,
            password: editarPassword,
          }),
        }
      )

      const datos = await respuesta.json()

      if (respuesta.ok) {
        const usuarioActualizado = {
          ...usuario,
          nombres: editarNombres,
          apellidos: editarApellidos,
          correo: editarCorreo,
        }

        setUsuario(usuarioActualizado)
        setEditarPassword('')

        const respuestaPerfil = await fetch(
          `http://localhost:3000/api/usuarios/perfil/${usuario.registro_academico}`
        )

        const datosPerfil = await respuestaPerfil.json()

        if (respuestaPerfil.ok) {
          setPerfil(datosPerfil)
        }

        setVista('mi-perfil')
        setMensaje('Perfil actualizado correctamente')
      } else {
        setMensaje(datos.mensaje || 'No se pudo actualizar el perfil')
      }
    } catch (error) {
      console.error(error)
      setMensaje('No se pudo actualizar el perfil')
    }
  }

  // =========================
  // OBTENER COMENTARIOS
  // =========================

  const obtenerComentariosPorPublicacion = async (idPublicacion) => {
    try {
      const respuesta = await fetch(
        `http://localhost:3000/api/comentarios/publicacion/${idPublicacion}`
      )

      const datos = await respuesta.json()

      if (respuesta.ok) {
        return datos
      }

      return []
    } catch (error) {
      console.error('Error al obtener comentarios:', error)
      return []
    }
  }

  // =========================
  // CARGAR COMENTARIOS DEL MURO
  // =========================

  const cargarComentarios = async (listaPublicaciones) => {
    const resultadoComentarios = {}

    for (const publicacion of listaPublicaciones) {
      resultadoComentarios[publicacion.id] =
        await obtenerComentariosPorPublicacion(publicacion.id)
    }

    setComentarios(resultadoComentarios)
  }

  // =========================
  // CREAR COMENTARIO
  // =========================

  const crearComentario = async (e, idPublicacion) => {
    e.preventDefault()

    const texto = (nuevoComentario[idPublicacion] || '').trim()

    if (!texto) {
      setMensajesComentario((anteriores) => ({
        ...anteriores,
        [idPublicacion]: 'Escribe un comentario antes de enviarlo',
      }))
      return
    }

    try {
      const respuesta = await fetch(
        'http://localhost:3000/api/comentarios',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id_publicacion: idPublicacion,
            id_usuario: usuario.id,
            contenido: texto,
          }),
        }
      )

      const datos = await respuesta.json()

      if (respuesta.ok) {
        setNuevoComentario((anteriores) => ({
          ...anteriores,
          [idPublicacion]: '',
        }))

        const comentariosActualizados =
          await obtenerComentariosPorPublicacion(idPublicacion)

        setComentarios((anteriores) => ({
          ...anteriores,
          [idPublicacion]: comentariosActualizados,
        }))

        setMensajesComentario((anteriores) => ({
          ...anteriores,
          [idPublicacion]: 'Comentario publicado correctamente',
        }))
      } else {
        setMensajesComentario((anteriores) => ({
          ...anteriores,
          [idPublicacion]: datos.mensaje || 'No se pudo publicar el comentario',
        }))
      }
    } catch (error) {
      console.error('Error al crear comentario:', error)

      setMensajesComentario((anteriores) => ({
        ...anteriores,
        [idPublicacion]: 'No se pudo conectar con el servidor',
      }))
    }
  }

  // =========================
  // FORMATEAR FECHA
  // =========================

  const formatearFecha = (fecha) => {
    if (!fecha) return ''

    return new Date(fecha).toLocaleString('es-GT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  // =========================
  // CERRAR SESIÓN
  // =========================

  const cerrarSesion = () => {
    setUsuario(null)
    setPublicaciones([])
    setCursos([])
    setCatedraticos([])
    setPerfil(null)
    setRegistroBusqueda('')
    setIdCursoAprobado('')
    setEditarNombres('')
    setEditarApellidos('')
    setEditarCorreo('')
    setEditarPassword('')
    setRecuperarRegistro('')
    setRecuperarCorreo('')
    setNuevaPassword('')
    setComentarios({})
    setNuevoComentario({})
    setMensajesComentario({})
    setMensaje('')
    setVista('login')
  }

  // ============================================================
  // CREAR PUBLICACIÓN
  // ============================================================

  if (vista === 'crear-publicacion' && usuario) {
    return (
      <div className="home-page">

        <header className="barra-superior">
          <h2>Sistema de Calificación de Cursos</h2>

          <button
            className="boton-salir"
            onClick={() => {
              setMensaje('')
              setVista('home')
            }}
          >
            Volver
          </button>
        </header>

        <main className="contenido-home">

          <section className="formulario-publicacion">

            <h1>Crear publicación</h1>

            <p>
              Escribe una opinión sobre un curso o un catedrático.
            </p>

            <form onSubmit={crearPublicacion}>

              <label>Curso</label>

              <select
                value={idCurso}
                onChange={(e) => setIdCurso(e.target.value)}
              >
                <option value="">
                  Selecciona un curso
                </option>

                {cursos.map((curso) => (
                  <option
                    key={curso.id}
                    value={curso.id}
                  >
                    {curso.nombre}
                  </option>
                ))}
              </select>

              <p className="separador">o</p>

              <label>Catedrático</label>

              <select
                value={idCatedratico}
                onChange={(e) => setIdCatedratico(e.target.value)}
              >
                <option value="">
                  Selecciona un catedrático
                </option>

                {catedraticos.map((catedratico) => (
                  <option
                    key={catedratico.id}
                    value={catedratico.id}
                  >
                    {catedratico.nombre}
                  </option>
                ))}
              </select>

              <label>Contenido</label>

              <textarea
                placeholder="Escribe tu opinión..."
                value={contenido}
                onChange={(e) => setContenido(e.target.value)}
                required
              />

              <button
                type="submit"
                className="boton-publicar"
              >
                Publicar
              </button>

            </form>

            {mensaje && (
              <p className="mensaje">
                {mensaje}
              </p>
            )}

          </section>

        </main>
      </div>
    )
  }

  // ============================================================
  // BUSCAR PERFIL
  // ============================================================

  if (vista === 'buscar-perfil' && usuario) {
    return (
      <div className="home-page">

        <header className="barra-superior">
          <h2>Sistema de Calificación de Cursos</h2>

          <button
            className="boton-salir"
            onClick={() => {
              setPerfil(null)
              setMensaje('')
              setVista('home')
            }}
          >
            Volver
          </button>
        </header>

        <main className="contenido-home">

          <section className="perfil-card">

            <h1>Buscar perfil</h1>

            <p>
              Ingresa el registro académico del estudiante.
            </p>

            <form
              className="formulario-busqueda"
              onSubmit={buscarPerfil}
            >
              <input
                type="text"
                placeholder="Ejemplo: 202600001"
                value={registroBusqueda}
                onChange={(e) =>
                  setRegistroBusqueda(e.target.value)
                }
              />

              <button type="submit">
                Buscar
              </button>
            </form>

            {mensaje && (
              <p className="mensaje">
                {mensaje}
              </p>
            )}

            {perfil && (
              <div className="datos-perfil">

                <h2>
                  {perfil.usuario.nombres}{' '}
                  {perfil.usuario.apellidos}
                </h2>

                <p>
                  <strong>Registro Académico:</strong>{' '}
                  {perfil.usuario.registro_academico}
                </p>

                <p>
                  <strong>Correo:</strong>{' '}
                  {perfil.usuario.correo}
                </p>

                <p>
                  <strong>Total de créditos:</strong>{' '}
                  {perfil.total_creditos}
                </p>

                <h3>Cursos aprobados</h3>

                {perfil.cursos_aprobados.length === 0 ? (
                  <p>
                    Este estudiante todavía no tiene cursos
                    aprobados registrados.
                  </p>
                ) : (
                  <div className="lista-cursos">

                    {perfil.cursos_aprobados.map((curso) => (
                      <div
                        className="curso-perfil"
                        key={curso.id}
                      >
                        <strong>{curso.nombre}</strong>

                        <span>
                          {curso.creditos} créditos
                        </span>
                      </div>
                    ))}

                  </div>
                )}

              </div>
            )}

          </section>

        </main>
      </div>
    )
  }

  // ============================================================
  // EDITAR PERFIL
  // ============================================================

  if (vista === 'editar-perfil' && usuario && perfil) {
    return (
      <div className="home-page">

        <header className="barra-superior">
          <h2>Sistema de Calificación de Cursos</h2>

          <button
            className="boton-salir"
            onClick={() => {
              setMensaje('')
              setEditarPassword('')
              setVista('mi-perfil')
            }}
          >
            Volver
          </button>
        </header>

        <main className="contenido-home">

          <section className="perfil-card">

            <h1>Editar perfil</h1>

            <p className="texto-editar-perfil">
              Puedes cambiar tus datos. El registro académico no se puede modificar.
            </p>

            <form
              className="formulario-editar-perfil"
              onSubmit={guardarCambiosPerfil}
            >

              <label>Registro Académico</label>

              <input
                type="text"
                value={usuario.registro_academico}
                disabled
              />

              <label>Nombres</label>

              <input
                type="text"
                value={editarNombres}
                onChange={(e) =>
                  setEditarNombres(e.target.value)
                }
                required
              />

              <label>Apellidos</label>

              <input
                type="text"
                value={editarApellidos}
                onChange={(e) =>
                  setEditarApellidos(e.target.value)
                }
                required
              />

              <label>Correo Electrónico</label>

              <input
                type="email"
                value={editarCorreo}
                onChange={(e) =>
                  setEditarCorreo(e.target.value)
                }
                required
              />

              <label>Contraseña</label>

              <input
                type="password"
                placeholder="Escribe la contraseña que deseas guardar"
                value={editarPassword}
                onChange={(e) =>
                  setEditarPassword(e.target.value)
                }
                required
              />

              <button
                type="submit"
                className="boton-guardar-perfil"
              >
                Guardar cambios
              </button>

            </form>

            {mensaje && (
              <p className="mensaje">
                {mensaje}
              </p>
            )}

          </section>

        </main>
      </div>
    )
  }

  // ============================================================
  // MI PERFIL
  // ============================================================

  if (vista === 'mi-perfil' && usuario && perfil) {
    const idsAprobados = perfil.cursos_aprobados.map((curso) => curso.id)

    const cursosDisponibles = cursos.filter(
      (curso) => !idsAprobados.includes(curso.id)
    )

    return (
      <div className="home-page">

        <header className="barra-superior">
          <h2>Sistema de Calificación de Cursos</h2>

          <button
            className="boton-salir"
            onClick={() => {
              setPerfil(null)
              setMensaje('')
              setIdCursoAprobado('')
              setVista('home')
            }}
          >
            Volver
          </button>
        </header>

        <main className="contenido-home">

          <section className="perfil-card">

            <h1>Mi perfil</h1>

            <div className="datos-perfil">

              <h2>
                {perfil.usuario.nombres}{' '}
                {perfil.usuario.apellidos}
              </h2>

              <p>
                <strong>Registro Académico:</strong>{' '}
                {perfil.usuario.registro_academico}
              </p>

              <p>
                <strong>Correo:</strong>{' '}
                {perfil.usuario.correo}
              </p>

              <p>
                <strong>Total de créditos:</strong>{' '}
                {perfil.total_creditos}
              </p>

              <button
                className="boton-editar-perfil"
                onClick={abrirEditarPerfil}
              >
                Editar perfil
              </button>

              {mensaje && (
                <p className="mensaje">
                  {mensaje}
                </p>
              )}

              <div className="gestion-cursos">
                <h3>Agregar curso aprobado</h3>

                <form
                  className="formulario-curso-aprobado"
                  onSubmit={agregarCursoAprobado}
                >
                  <select
                    value={idCursoAprobado}
                    onChange={(e) =>
                      setIdCursoAprobado(e.target.value)
                    }
                  >
                    <option value="">
                      Selecciona un curso
                    </option>

                    {cursosDisponibles.map((curso) => (
                      <option
                        key={curso.id}
                        value={curso.id}
                      >
                        {curso.nombre} - {curso.creditos} créditos
                      </option>
                    ))}
                  </select>

                  <button
                    type="submit"
                    disabled={cursosDisponibles.length === 0}
                  >
                    Agregar
                  </button>
                </form>

              </div>

              <h3>Mis cursos aprobados</h3>

              {perfil.cursos_aprobados.length === 0 ? (
                <p>
                  Todavía no tienes cursos aprobados registrados.
                </p>
              ) : (
                <div className="lista-cursos">

                  {perfil.cursos_aprobados.map((curso) => (
                    <div
                      className="curso-perfil curso-perfil-editable"
                      key={curso.id}
                    >
                      <div>
                        <strong>{curso.nombre}</strong>
                        <span>{curso.creditos} créditos</span>
                      </div>

                      <button
                        className="boton-eliminar-curso"
                        onClick={() =>
                          eliminarCursoAprobado(curso.id)
                        }
                      >
                        Eliminar
                      </button>
                    </div>
                  ))}

                </div>
              )}

            </div>

          </section>

        </main>
      </div>
    )
  }

  // ============================================================
  // HOME
  // ============================================================

  if (vista === 'home' && usuario) {
    return (
      <div className="home-page">

        <header className="barra-superior">

          <h2>
            Sistema de Calificación de Cursos
          </h2>

          <button
            className="boton-salir"
            onClick={cerrarSesion}
          >
            Cerrar sesión
          </button>

        </header>

        <main className="contenido-home">

          <section className="bienvenida">

            <h1>
              Bienvenido, {usuario.nombres} {usuario.apellidos}
            </h1>

            <p>
              Registro Académico: {usuario.registro_academico}
            </p>

          </section>

          <section className="menu-principal">

            <button
              onClick={obtenerPublicaciones}
            >
              Inicio
            </button>

            <button
              onClick={abrirCrearPublicacion}
            >
              Crear publicación
            </button>

            <button
              onClick={abrirBuscarPerfil}
            >
              Buscar perfil
            </button>

            <button
              onClick={abrirMiPerfil}
            >
              Mi perfil
            </button>

          </section>

          <section className="muro">

            <div className="titulo-muro">

              <h2>Publicaciones</h2>

              <button
                className="boton-actualizar"
                onClick={() => obtenerPublicaciones(true)}
              >
                Actualizar
              </button>

            </div>

            {mensaje && (
              <p className="mensaje">
                {mensaje}
              </p>
            )}

            {publicaciones.length === 0 ? (

              <p className="texto-vacio">
                Todavía no hay publicaciones.
              </p>

            ) : (

              publicaciones.map((publicacion) => (

                <div
                  className="publicacion"
                  key={publicacion.id}
                >

                  <h3>
                    {publicacion.nombres}{' '}
                    {publicacion.apellidos}
                  </h3>

                  <p className="registro-publicacion">
                    Registro Académico:{' '}
                    {publicacion.registro_academico}
                  </p>

                  {publicacion.curso && (
                    <p>
                      <strong>Curso:</strong>{' '}
                      {publicacion.curso}
                    </p>
                  )}

                  {publicacion.catedratico && (
                    <p>
                      <strong>Catedrático:</strong>{' '}
                      {publicacion.catedratico}
                    </p>
                  )}

                  <p className="contenido-publicacion">
                    {publicacion.contenido}
                  </p>

                  <p className="fecha-publicacion">
                    {formatearFecha(publicacion.fecha_hora)}
                  </p>

                  <div className="seccion-comentarios">

                    <h4>Comentarios</h4>

                    {(comentarios[publicacion.id] || []).length === 0 ? (
                      <p className="sin-comentarios">
                        Aún no hay comentarios.
                      </p>
                    ) : (
                      (comentarios[publicacion.id] || []).map((comentario) => (
                        <div
                          className="comentario"
                          key={comentario.id}
                        >
                          <div className="comentario-encabezado">
                            <strong>
                              {comentario.nombres}{' '}
                              {comentario.apellidos}
                            </strong>

                            <span>
                              {formatearFecha(comentario.fecha_hora)}
                            </span>
                          </div>

                          <p>{comentario.contenido}</p>
                        </div>
                      ))
                    )}

                    <form
                      className="formulario-comentario"
                      onSubmit={(e) =>
                        crearComentario(e, publicacion.id)
                      }
                    >
                      <input
                        type="text"
                        placeholder="Escribe un comentario..."
                        value={nuevoComentario[publicacion.id] || ''}
                        onChange={(e) => {
                          setNuevoComentario((anteriores) => ({
                            ...anteriores,
                            [publicacion.id]: e.target.value,
                          }))

                          setMensajesComentario((anteriores) => ({
                            ...anteriores,
                            [publicacion.id]: '',
                          }))
                        }}
                      />

                      <button type="submit">
                        Comentar
                      </button>
                    </form>

                    {mensajesComentario[publicacion.id] && (
                      <p className="mensaje-comentario">
                        {mensajesComentario[publicacion.id]}
                      </p>
                    )}

                  </div>

                </div>

              ))

            )}

          </section>

        </main>
      </div>
    )
  }

  // ============================================================
  // RECUPERAR CONTRASEÑA
  // ============================================================

  if (vista === 'recuperar') {
    return (
      <div className="pagina-login">

        <div className="login-card">

          <h1>Recuperar contraseña</h1>

          <p className="subtitulo">
            Verifica tus datos y escribe una nueva contraseña.
          </p>

          <form onSubmit={recuperarContrasena}>

            <label>
              Registro Académico
            </label>

            <input
              type="text"
              placeholder="Ingresa tu carné"
              value={recuperarRegistro}
              onChange={(e) =>
                setRecuperarRegistro(e.target.value)
              }
              required
            />

            <label>
              Correo Electrónico
            </label>

            <input
              type="email"
              placeholder="Ingresa tu correo"
              value={recuperarCorreo}
              onChange={(e) =>
                setRecuperarCorreo(e.target.value)
              }
              required
            />

            <label>
              Nueva contraseña
            </label>

            <input
              type="password"
              placeholder="Escribe tu nueva contraseña"
              value={nuevaPassword}
              onChange={(e) =>
                setNuevaPassword(e.target.value)
              }
              required
            />

            <button type="submit">
              Actualizar contraseña
            </button>

          </form>

          {mensaje && (
            <p className="mensaje">
              {mensaje}
            </p>
          )}

          <a
            href="#"
            onClick={(e) => {
              e.preventDefault()
              setMensaje('')
              setVista('login')
            }}
          >
            Volver al inicio de sesión
          </a>

        </div>

      </div>
    )
  }

  // ============================================================
  // LOGIN Y REGISTRO
  // ============================================================

  return (
    <div className="pagina-login">

      <div className="login-card">

        {vista === 'login' && (
          <>

            <h1>
              Sistema de Calificación de Cursos
            </h1>

            <p className="subtitulo">
              Iniciar sesión
            </p>

            <form onSubmit={iniciarSesion}>

              <label>
                Registro Académico
              </label>

              <input
                type="text"
                placeholder="Ingresa tu carné"
                value={registroAcademico}
                onChange={(e) =>
                  setRegistroAcademico(e.target.value)
                }
                required
              />

              <label>
                Contraseña
              </label>

              <input
                type="password"
                placeholder="Ingresa tu contraseña"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                required
              />

              <button type="submit">
                Ingresar
              </button>

            </form>

            {mensaje && (
              <p className="mensaje">
                {mensaje}
              </p>
            )}

            <a
              href="#"
              onClick={(e) => {
                e.preventDefault()
                setMensaje('')
                setRecuperarRegistro('')
                setRecuperarCorreo('')
                setNuevaPassword('')
                setVista('recuperar')
              }}
            >
              ¿Olvidaste tu contraseña?
            </a>

            <a
              href="#"
              onClick={(e) => {
                e.preventDefault()
                setMensaje('')
                setVista('registro')
              }}
            >
              Crear una cuenta
            </a>

          </>
        )}

        {vista === 'registro' && (
          <>

            <h1>
              Crear una cuenta
            </h1>

            <p className="subtitulo">
              Registro de usuario
            </p>

            <form onSubmit={registrarUsuario}>

              <label>
                Registro Académico
              </label>

              <input
                type="text"
                placeholder="Ingresa tu carné"
                value={registroAcademico}
                onChange={(e) =>
                  setRegistroAcademico(e.target.value)
                }
                required
              />

              <label>Nombres</label>

              <input
                type="text"
                placeholder="Ingresa tus nombres"
                value={nombres}
                onChange={(e) =>
                  setNombres(e.target.value)
                }
                required
              />

              <label>Apellidos</label>

              <input
                type="text"
                placeholder="Ingresa tus apellidos"
                value={apellidos}
                onChange={(e) =>
                  setApellidos(e.target.value)
                }
                required
              />

              <label>
                Correo Electrónico
              </label>

              <input
                type="email"
                placeholder="Ingresa tu correo"
                value={correo}
                onChange={(e) =>
                  setCorreo(e.target.value)
                }
                required
              />

              <label>Contraseña</label>

              <input
                type="password"
                placeholder="Ingresa tu contraseña"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                required
              />

              <button type="submit">
                Registrarse
              </button>

            </form>

            {mensaje && (
              <p className="mensaje">
                {mensaje}
              </p>
            )}

            <a
              href="#"
              onClick={(e) => {
                e.preventDefault()
                setMensaje('')
                setVista('login')
              }}
            >
              Volver al inicio de sesión
            </a>

          </>
        )}

      </div>
    </div>
  )
}

export default App
