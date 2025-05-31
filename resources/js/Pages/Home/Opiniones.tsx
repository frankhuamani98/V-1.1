import type React from "react"
import { useState } from "react"
import { useForm } from "@inertiajs/react"
import type { User } from "@/types"
import { Star, ThumbsUp, MessageSquare, Loader2, UserIcon, BadgeCheck } from "lucide-react"

interface OpinionesProps {
  opiniones: {
    lista: Array<{
      id: number
      calificacion: number
      contenido: string
      util: number
      es_soporte: boolean
      created_at: string
      usuario: {
        id: number
        nombre: string
        iniciales: string
      }
      respuestas: Array<{
        id: number
        contenido: string
        es_soporte: boolean
        created_at: string
        usuario: {
          id: number
          nombre: string
          iniciales: string
        }
      }>
    }>
    promedio: number
    total: number
    conteo: {
      1: number
      2: number
      3: number
      4: number
      5: number
    }
  }
  auth: {
    user: User | null
  }
}

export default function Opiniones({ opiniones, auth }: OpinionesProps) {
  const [mostrarFormularioRespuesta, setMostrarFormularioRespuesta] = useState<number | null>(null)

  const {
    data: opinionData,
    setData: setOpinionData,
    post: postOpinion,
    processing: processingOpinion,
    errors: opinionErrors,
    reset: resetOpinion,
  } = useForm({
    calificacion: 5,
    contenido: "",
  })

  const {
    data: respuestaData,
    setData: setRespuestaData,
    post: postRespuesta,
    processing: processingRespuesta,
    errors: respuestaErrors,
    reset: resetRespuesta,
  } = useForm({
    contenido: "",
  })

  const handleOpinionSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    postOpinion(route("opiniones.store"), {
      preserveScroll: true,
      onSuccess: () => {
        resetOpinion("contenido")
        setOpinionData("contenido", "")
      },
    })
  }

  const handleRespuestaSubmit = (e: React.FormEvent, opinionId: number) => {
    e.preventDefault()
    postRespuesta(route("opiniones.responder", opinionId), {
      preserveScroll: true,
      onSuccess: () => {
        resetRespuesta()
        setMostrarFormularioRespuesta(null)
      },
    })
  }

  const marcarUtil = (opinionId: number) => {
    if (!auth.user) {
      alert("Debes iniciar sesión para marcar una opinión como útil")
      return
    }

    postRespuesta(route("opiniones.util", opinionId), {
      preserveScroll: true,
    })
  }

  const StarRating = ({
    rating,
    size = "md",
    interactive = false,
  }: {
    rating: number
    size?: "sm" | "md" | "lg"
    interactive?: boolean
  }) => {
    const sizeClasses = {
      sm: "w-3.5 h-3.5",
      md: "w-5 h-5",
      lg: "w-6 h-6",
    }

    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <div
            key={star}
            className={interactive ? "cursor-pointer" : ""}
            onClick={interactive ? () => setOpinionData("calificacion", star) : undefined}
          >
            <Star
              className={`${sizeClasses[size]} ${star <= rating ? "text-amber-400 fill-amber-400" : "text-gray-300 dark:text-gray-600"} ${interactive && star <= rating ? "hover:text-amber-500" : ""}`}
            />
          </div>
        ))}
      </div>
    )
  }

  const UserAvatar = ({
    iniciales,
    esSoporte = false,
    size = "md",
  }: {
    iniciales: string
    esSoporte?: boolean
    size?: "sm" | "md" | "lg"
  }) => {
    const sizeClasses = {
      sm: "w-8 h-8 text-xs",
      md: "w-10 h-10 text-sm",
      lg: "w-12 h-12 text-base",
    }

    const bgColor = esSoporte ? "bg-emerald-600 dark:bg-emerald-700" : "bg-violet-600 dark:bg-violet-700"

    return (
      <div
        className={`${sizeClasses[size]} ${bgColor} rounded-full flex items-center justify-center text-white font-medium shadow-sm`}
      >
        {iniciales}
      </div>
    )
  }

  return (
    <section className="py-16 bg-gradient-to-b from-white to-slate-50 dark:from-[hsl(222.2,84%,4.9%)] dark:to-[hsl(222.2,84%,4.9%)]/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Opiniones de clientes</h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Descubre lo que otros clientes opinan sobre nuestros productos y servicios
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 border border-gray-100 dark:border-gray-700 flex flex-col items-center text-center">
            <div className="flex flex-col items-center mb-6">
              <div className="text-5xl font-bold text-gray-900 dark:text-white mb-2">
                {opiniones.promedio.toFixed(1)}
              </div>
              <StarRating rating={Math.round(opiniones.promedio)} size="lg" />
              <div className="text-sm text-gray-500 dark:text-gray-400 mt-2">Basado en {opiniones.total} opiniones</div>
            </div>

            <div className="w-full space-y-2">
              {[5, 4, 3, 2, 1].map((rating) => {
                const count = opiniones.conteo[rating as keyof typeof opiniones.conteo]
                const porcentaje = opiniones.total > 0 ? (count / opiniones.total) * 100 : 0

                return (
                  <div key={rating} className="flex items-center gap-2">
                    <div className="w-6 text-sm font-medium text-gray-700 dark:text-gray-300">{rating}</div>
                    <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                    <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-400 rounded-full transition-all duration-500 ease-out"
                        style={{ width: `${porcentaje}%` }}
                      ></div>
                    </div>
                    <div className="w-8 text-xs text-right text-gray-500 dark:text-gray-400">{count}</div>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 border border-gray-100 dark:border-gray-700 h-full">
              {auth.user ? (
                <>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Comparte tu experiencia</h3>
                  <form onSubmit={handleOpinionSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Tu calificación
                      </label>
                      <div className="flex items-center gap-2">
                        <StarRating rating={opinionData.calificacion} size="md" interactive={true} />
                        <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
                          {opinionData.calificacion === 5
                            ? "Excelente"
                            : opinionData.calificacion === 4
                              ? "Muy bueno"
                              : opinionData.calificacion === 3
                                ? "Bueno"
                                : opinionData.calificacion === 2
                                  ? "Regular"
                                  : "Malo"}
                        </span>
                      </div>
                      {opinionErrors.calificacion && (
                        <div className="text-rose-500 text-sm mt-1">{opinionErrors.calificacion}</div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Tu opinión
                      </label>
                      <textarea
                        value={opinionData.contenido}
                        onChange={(e) => setOpinionData("contenido", e.target.value)}
                        className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg px-4 py-3 focus:ring-2 focus:ring-violet-500 focus:border-violet-500 text-gray-800 dark:text-white transition-colors"
                        rows={4}
                        placeholder="Comparte tu experiencia con este producto o servicio..."
                      ></textarea>
                      {opinionErrors.contenido && (
                        <div className="text-rose-500 text-sm mt-1">{opinionErrors.contenido}</div>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={processingOpinion}
                      className="px-5 py-2.5 bg-violet-600 hover:bg-violet-700 text-white font-medium rounded-lg transition-all duration-200 inline-flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed shadow-sm hover:shadow"
                    >
                      {processingOpinion ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Enviando...
                        </>
                      ) : (
                        "Publicar opinión"
                      )}
                    </button>
                  </form>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center text-center h-full py-8">
                  <div className="w-16 h-16 bg-violet-100 dark:bg-violet-900/30 rounded-full flex items-center justify-center mb-4">
                    <UserIcon className="w-8 h-8 text-violet-600 dark:text-violet-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    ¡Comparte tu experiencia!
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md">
                    Inicia sesión para dejar tu opinión y ayudar a otros clientes a tomar mejores decisiones.
                  </p>
                  <a
                    href={route("login")}
                    className="px-5 py-2.5 bg-violet-600 hover:bg-violet-700 text-white font-medium rounded-lg transition-all duration-200 inline-flex items-center shadow-sm hover:shadow"
                  >
                    Iniciar sesión
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Todas las opiniones</h3>
          </div>

          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {opiniones.lista.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
                <MessageSquare className="w-14 h-14 text-gray-300 dark:text-gray-600 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">No hay opiniones todavía</h3>
                <p className="text-gray-500 dark:text-gray-400 max-w-md">
                  ¡Sé el primero en compartir tu experiencia con este producto!
                </p>
              </div>
            ) : (
              opiniones.lista.map((opinion) => (
                <div key={opinion.id} className="p-6">
                  <div className="flex gap-4">
                    <UserAvatar iniciales={opinion.usuario.iniciales} esSoporte={opinion.es_soporte} />

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <h4 className="font-medium text-gray-900 dark:text-white">{opinion.usuario.nombre}</h4>

                        {opinion.es_soporte && (
                          <span className="inline-flex items-center gap-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs px-2 py-0.5 rounded-full font-medium">
                            <BadgeCheck className="w-3 h-3" />
                            Soporte
                          </span>
                        )}

                        <span className="text-gray-500 dark:text-gray-400 text-sm">{opinion.created_at}</span>
                      </div>

                      <div className="mb-3">
                        <StarRating rating={opinion.calificacion} size="sm" />
                      </div>

                      <div className="prose prose-sm dark:prose-invert max-w-none mb-4">
                        <p className="text-gray-700 dark:text-gray-300">{opinion.contenido}</p>
                      </div>

                      <div className="flex flex-wrap items-center gap-4 mt-2">
                        <button
                          onClick={() => marcarUtil(opinion.id)}
                          className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                        >
                          <ThumbsUp className="w-4 h-4" />
                          <span>Útil ({opinion.util})</span>
                        </button>

                        {auth.user && (
                          <button
                            onClick={() =>
                              setMostrarFormularioRespuesta(
                                mostrarFormularioRespuesta === opinion.id ? null : opinion.id,
                              )
                            }
                            className="inline-flex items-center gap-1.5 text-sm text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 transition-colors"
                          >
                            <MessageSquare className="w-4 h-4" />
                            <span>Responder</span>
                          </button>
                        )}
                      </div>

                      {mostrarFormularioRespuesta === opinion.id && auth.user && (
                        <div className="mt-4 bg-slate-50 dark:bg-gray-700/40 p-4 rounded-lg border border-slate-200 dark:border-gray-700">
                          <form onSubmit={(e) => handleRespuestaSubmit(e, opinion.id)}>
                            <textarea
                              value={respuestaData.contenido}
                              onChange={(e) => setRespuestaData("contenido", e.target.value)}
                              className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg px-3 py-2 mb-3 focus:ring-2 focus:ring-violet-500 focus:border-violet-500 text-gray-800 dark:text-white text-sm transition-colors"
                              rows={3}
                              placeholder="Escribe tu respuesta..."
                            ></textarea>

                            {respuestaErrors.contenido && (
                              <div className="text-rose-500 text-sm mb-3">{respuestaErrors.contenido}</div>
                            )}

                            <div className="flex gap-2">
                              <button
                                type="submit"
                                disabled={processingRespuesta}
                                className="px-3 py-1.5 text-sm bg-violet-600 hover:bg-violet-700 text-white font-medium rounded-md transition-colors inline-flex items-center disabled:opacity-70 shadow-sm"
                              >
                                {processingRespuesta ? (
                                  <>
                                    <Loader2 className="w-3 h-3 mr-2 animate-spin" />
                                    Enviando...
                                  </>
                                ) : (
                                  "Responder"
                                )}
                              </button>

                              <button
                                type="button"
                                onClick={() => setMostrarFormularioRespuesta(null)}
                                className="px-3 py-1.5 text-sm bg-slate-200 dark:bg-gray-600 text-slate-700 dark:text-slate-200 font-medium rounded-md hover:bg-slate-300 dark:hover:bg-gray-500 transition-colors"
                              >
                                Cancelar
                              </button>
                            </div>
                          </form>
                        </div>
                      )}

                      {opinion.respuestas.length > 0 && (
                        <div className="mt-5 space-y-3 pl-4 border-l-2 border-slate-200 dark:border-slate-700">
                          {opinion.respuestas.map((respuesta) => (
                            <div key={respuesta.id} className="bg-slate-50 dark:bg-gray-700/30 rounded-lg p-4">
                              <div className="flex gap-3">
                                <UserAvatar
                                  iniciales={respuesta.usuario.iniciales}
                                  esSoporte={respuesta.es_soporte}
                                  size="sm"
                                />

                                <div className="flex-1 min-w-0">
                                  <div className="flex flex-wrap items-center gap-2 mb-1">
                                    <span className="font-medium text-sm text-gray-900 dark:text-white">
                                      {respuesta.usuario.nombre}
                                    </span>

                                    {respuesta.es_soporte && (
                                      <span className="inline-flex items-center gap-1 bg-emerald-100 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 text-xs px-1.5 py-0.5 rounded-full font-medium">
                                        <BadgeCheck className="w-2.5 h-2.5" />
                                        Soporte
                                      </span>
                                    )}

                                    <span className="text-gray-500 dark:text-gray-400 text-xs">
                                      {respuesta.created_at}
                                    </span>
                                  </div>

                                  <p className="text-sm text-gray-700 dark:text-gray-300">{respuesta.contenido}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
