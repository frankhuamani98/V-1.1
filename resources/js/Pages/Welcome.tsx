import { useState } from 'react';
import { Button } from "@/Components/ui/button";
import { Card } from "@/Components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar";
import { Textarea } from "@/Components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/Components/ui/dialog";
import { Star, StarHalf, ThumbsUp, MessageSquare, Filter, Clock, TrendingUp } from "lucide-react";

interface Review {
  id: string;
  author: string;
  avatar: string;
  rating: number;
  date: string;
  content: string;
  likes: number;
  comments: Comment[];
  showReplyForm: boolean;
  showComments: boolean;
  isLiked: boolean;
}

interface Comment {
  id: string;
  author: string;
  content: string;
}

function App() {
  const [reviews, setReviews] = useState<Review[]>([
    {
      id: '1',
      author: 'María García',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
      rating: 4.5,
      date: 'Hace 2 días',
      content: 'Excelente servicio y atención al cliente. Los repuestos son de alta calidad y llegaron en perfecto estado. Definitivamente volveré a comprar aquí.',
      likes: 24,
      comments: [],
      showReplyForm: false,
      showComments: false,
      isLiked: false
    },
    {
      id: '2',
      author: 'Carlos Rodríguez',
      avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=150',
      rating: 5,
      date: 'Hace 5 días',
      content: 'Buenos precios y amplio catálogo de repuestos. La entrega fue rápida y el producto exactamente lo que necesitaba para mi moto.',
      likes: 18,
      comments: [],
      showReplyForm: false,
      showComments: false,
      isLiked: false
    },
    {
      id: '3',
      author: 'Laura Martínez',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      rating: 2,
      date: 'Hace 10 días',
      content: 'No quedé satisfecha con el producto. La calidad no fue la esperada.',
      likes: 5,
      comments: [],
      showReplyForm: false,
      showComments: false,
      isLiked: false
    },
    {
      id: '4',
      author: 'Pedro Sánchez',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dc7d4f8f3?w=150',
      rating: 3,
      date: 'Hace 15 días',
      content: 'El producto llegó tarde y no cumplió con mis expectativas.',
      likes: 8,
      comments: [],
      showReplyForm: false,
      showComments: false,
      isLiked: false
    },
    {
      id: '5',
      author: 'Ana Gómez',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
      rating: 4,
      date: 'Hace 20 días',
      content: 'Muy buen servicio, pero el producto tenía un pequeño defecto.',
      likes: 12,
      comments: [],
      showReplyForm: false,
      showComments: false,
      isLiked: false
    },
    {
      id: '6',
      author: 'Juan Pérez',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dc7d4f8f3?w=150',
      rating: 1,
      date: 'Hace 25 días',
      content: 'Muy decepcionado con la calidad del producto. No lo recomendaría.',
      likes: 3,
      comments: [],
      showReplyForm: false,
      showComments: false,
      isLiked: false
    },
    {
      id: '7',
      author: 'Luis Torres',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      rating: 5,
      date: 'Hace 30 días',
      content: 'Excelente producto y servicio. Muy recomendable.',
      likes: 20,
      comments: [],
      showReplyForm: false,
      showComments: false,
      isLiked: false
    },
    {
      id: '8',
      author: 'Sofía Ramírez',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
      rating: 4,
      date: 'Hace 35 días',
      content: 'Buen producto, pero la entrega tardó más de lo esperado.',
      likes: 15,
      comments: [],
      showReplyForm: false,
      showComments: false,
      isLiked: false
    },
    {
      id: '9',
      author: 'Diego López',
      avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=150',
      rating: 3,
      date: 'Hace 40 días',
      content: 'El producto es aceptable, pero esperaba más por el precio.',
      likes: 10,
      comments: [],
      showReplyForm: false,
      showComments: false,
      isLiked: false
    },
    {
      id: '10',
      author: 'Clara Fernández',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
      rating: 2,
      date: 'Hace 45 días',
      content: 'No volvería a comprar aquí. La calidad del producto fue muy baja.',
      likes: 4,
      comments: [],
      showReplyForm: false,
      showComments: false,
      isLiked: false
    }
  ]);

  const [selectedRating, setSelectedRating] = useState<number>(0);
  const [reviewText, setReviewText] = useState<string>('');
  const [replyTexts, setReplyTexts] = useState<Record<string, string>>({});
  const [dialogOpen, setDialogOpen] = useState(false);
  const [sortOption, setSortOption] = useState<string>('recent');
  const [visibleReviews, setVisibleReviews] = useState<Review[]>(reviews.slice(0, 4));
  const [filteredRating, setFilteredRating] = useState<number | null>(null);

  const toggleReplyForm = (reviewId: string) => {
    setReviews(reviews.map(review =>
      review.id === reviewId
        ? { ...review, showReplyForm: !review.showReplyForm }
        : review
    ));
  };

  const toggleComments = (reviewId: string) => {
    setReviews(reviews.map(review =>
      review.id === reviewId
        ? { ...review, showComments: !review.showComments }
        : review
    ));
  };

  const toggleLike = (reviewId: string) => {
    setReviews(reviews.map(review =>
      review.id === reviewId
        ? { ...review, isLiked: !review.isLiked, likes: review.isLiked ? review.likes - 1 : review.likes + 1 }
        : review
    ));
  };

  const handleReplyTextChange = (reviewId: string, text: string) => {
    setReplyTexts({
      ...replyTexts,
      [reviewId]: text
    });
  };

  const submitReply = (reviewId: string) => {
    const newComment: Comment = {
      id: `${reviewId}-${reviews.find(review => review.id === reviewId)?.comments.length}`,
      author: 'frankmamweo',
      content: replyTexts[reviewId]
    };

    setReviews(reviews.map(review =>
      review.id === reviewId
        ? { ...review, comments: [...review.comments, newComment] }
        : review
    ));

    setReplyTexts({
      ...replyTexts,
      [reviewId]: ''
    });
    toggleReplyForm(reviewId);
  };

  const submitReview = () => {
    const newReview: Review = {
      id: `${reviews.length + 1}`,
      author: 'frankmamaweo',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
      rating: selectedRating,
      date: 'Ahora',
      content: reviewText,
      likes: 0,
      comments: [],
      showReplyForm: false,
      showComments: false,
      isLiked: false
    };

    setReviews([newReview, ...reviews]);
    setVisibleReviews([newReview, ...visibleReviews]);

    setSelectedRating(0);
    setReviewText('');
    setDialogOpen(false);
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`star-${i}`} className="fill-yellow-400 text-yellow-400" size={14} />);
    }

    if (hasHalfStar) {
      stars.push(<StarHalf key="half-star" className="fill-yellow-400 text-yellow-400" size={14} />);
    }

    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-star-${i}`} className="text-gray-300" size={14} />);
    }

    return stars;
  };

  const renderRatingStars = () => {
    return Array.from({ length: 5 }).map((_, index) => (
      <Star
        key={`rating-star-${index}`}
        className={index < selectedRating ? "fill-yellow-400 text-yellow-400 cursor-pointer hover:scale-110 transition-transform" : "text-gray-300 cursor-pointer hover:text-yellow-200 hover:scale-110 transition-transform"}
        size={20}
        onClick={() => setSelectedRating(index + 1)}
      />
    ));
  };

  const sortedReviews = () => {
    let filtered = [...reviews];

    if (filteredRating !== null) {
      filtered = filtered.filter(review => review.rating === filteredRating);
    }

    switch (sortOption) {
      case 'recent':
        return filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      case 'rating':
        return filtered.sort((a, b) => b.rating - a.rating);
      case 'relevance':
        return filtered.sort((a, b) => b.likes - a.likes);
      default:
        return filtered;
    }
  };

  const loadMoreReviews = () => {
    const remainingReviews = reviews.slice(visibleReviews.length, visibleReviews.length + 4);
    setVisibleReviews([...visibleReviews, ...remainingReviews]);
  };

  const renderComments = (reviewId: string) => {
    const comments = reviews.find(review => review.id === reviewId)?.comments || [];

    return (
      <div className="mt-2 pl-3 border-l-2 border-gray-100 space-y-2">
        {comments.map(comment => (
          <div key={comment.id} className="flex gap-2 items-start">
            <Avatar className="h-5 w-5 ring-1 ring-gray-100">
              <AvatarImage src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150" alt={comment.author} />
              <AvatarFallback>{comment.author.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="bg-gray-50 rounded-lg p-2 flex-1">
              <h4 className="font-medium text-xs">{comment.author}</h4>
              <p className="text-xs text-gray-700">{comment.content}</p>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const ratingCounts = {
    5: reviews.filter(review => review.rating === 5).length,
    4: reviews.filter(review => review.rating === 4).length,
    3: reviews.filter(review => review.rating === 3).length,
    2: reviews.filter(review => review.rating === 2).length,
    1: reviews.filter(review => review.rating === 1).length,
  };

  const totalRatings = reviews.reduce((acc, review) => acc + review.rating, 0);
  const averageRating = (totalRatings / reviews.length).toFixed(1);

  const calculatePercentage = (count: number) => {
    return Math.round((count / reviews.length) * 100);
  };

  return (
    <div className="bg-gradient-to-b from-gray-50 to-white min-h-screen">
      <div className="container mx-auto py-8 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          {/* Header with Stats Dashboard */}
          <div className="mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-violet-600">
              Opiniones de Clientes
            </h1>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <Card className="p-4 text-center bg-white rounded-lg shadow border-0">
                <div className="text-3xl sm:text-4xl font-bold text-blue-600 mb-1">{averageRating}</div>
                <div className="flex justify-center mb-1">
                  {renderStars(parseFloat(averageRating))}
                </div>
                <p className="text-gray-500 text-xs">Promedio de {reviews.length} opiniones</p>
              </Card>

              <Card className="p-4 bg-white rounded-lg shadow border-0">
                <div className="space-y-2">
                  {[5, 4, 3, 2, 1].map((star) => (
                    <div key={star} className="flex items-center gap-2">
                      <span className="text-xs font-medium w-3">{star}</span>
                      <Star className="fill-yellow-400 text-yellow-400" size={12} />
                      <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-blue-500 to-violet-500 rounded-full"
                          style={{ width: `${calculatePercentage(ratingCounts[star as keyof typeof ratingCounts])}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-500 w-8 text-right">
                        {calculatePercentage(ratingCounts[star as keyof typeof ratingCounts])}%
                      </span>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="p-4 text-center bg-gradient-to-br from-blue-500 to-violet-600 rounded-lg shadow border-0 text-white">
                <h3 className="font-semibold text-sm mb-2">¿Has utilizado nuestros productos?</h3>
                <p className="text-xs mb-3">Comparte tu experiencia y ayuda a otros clientes</p>
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="w-full bg-white text-blue-600 hover:bg-gray-100 hover:text-blue-700 text-xs h-8">
                      Escribir Opinión
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle className="text-lg font-bold">Comparte tu experiencia</DialogTitle>
                      <DialogDescription className="text-sm">
                        Tu opinión ayuda a otros clientes a tomar mejores decisiones.
                      </DialogDescription>
                    </DialogHeader>

                    <div className="py-4">
                      <div className="mb-4">
                        <label className="block text-xs font-medium mb-1">¿Cómo calificarías tu experiencia?</label>
                        <div className="flex gap-1 justify-center">
                          {renderRatingStars()}
                        </div>
                      </div>

                      <div className="mb-3">
                        <label className="block text-xs font-medium mb-1">Cuéntanos más sobre tu experiencia</label>
                        <Textarea
                          value={reviewText}
                          onChange={(e) => setReviewText(e.target.value)}
                          rows={3}
                          placeholder="Escribe tu opinión detallada aquí..."
                          className="resize-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                        />
                      </div>
                    </div>

                    <DialogFooter className="sm:justify-between">
                      <Button variant="outline" onClick={() => setDialogOpen(false)} className="border-gray-300 text-xs h-8">
                        Cancelar
                      </Button>
                      <Button
                        onClick={submitReview}
                        disabled={selectedRating === 0 || !reviewText.trim()}
                        className="bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-xs h-8"
                      >
                        Publicar opinión
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </Card>
            </div>
          </div>

          {/* Filters Section */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 space-y-3 sm:space-y-0 bg-white rounded-lg shadow p-4">
            <div className="relative w-full sm:w-40">
              <div className="flex items-center space-x-1 text-gray-700 font-medium mb-1">
                <Filter size={14} className="text-gray-500" />
                <span className="text-xs">Ordenar por</span>
              </div>
              <Select value={sortOption} onValueChange={setSortOption}>
                <SelectTrigger className="w-full bg-gray-50 border border-gray-200 rounded-md py-1.5 pl-3 pr-6 text-xs h-8">
                  <SelectValue placeholder="Ordenar por" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent" className="text-xs">
                    <div className="flex items-center gap-1">
                      <Clock size={12} className="text-blue-500" />
                      <span>Más recientes</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="rating" className="text-xs">
                    <div className="flex items-center gap-1">
                      <Star size={12} className="text-yellow-500" />
                      <span>Mejor calificación</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="relevance" className="text-xs">
                    <div className="flex items-center gap-1">
                      <TrendingUp size={12} className="text-green-500" />
                      <span>Más relevantes</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-wrap gap-1 items-center">
              <div className="flex items-center space-x-1 mr-2">
                <Star size={14} className="text-gray-500" />
                <span className="text-xs font-medium text-gray-700">Filtrar por</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {[5, 4, 3, 2, 1].map((rating) => (
                  <Button
                    key={rating}
                    variant={filteredRating === rating ? "default" : "outline"}
                    className={`rounded-full transition-all duration-200 shadow-sm text-xs h-7 px-2 ${
                      filteredRating === rating
                        ? "bg-gradient-to-r from-blue-500 to-violet-500 hover:from-blue-600 hover:to-violet-600 text-white"
                        : "hover:border-blue-400 hover:text-blue-500 hover:bg-blue-50"
                    }`}
                    onClick={() => setFilteredRating(filteredRating === rating ? null : rating)}
                  >
                    {rating}★ ({ratingCounts[rating as keyof typeof ratingCounts]})
                  </Button>
                ))}
                {filteredRating !== null && (
                  <Button
                    variant="outline"
                    className="rounded-full border-dashed hover:bg-blue-50 transition-colors text-xs h-7 px-2"
                    onClick={() => setFilteredRating(null)}
                  >
                    Ver todas
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Reviews List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sortedReviews().slice(0, visibleReviews.length).map((review) => (
              <div
                key={review.id}
                className={`bg-white rounded-md shadow-sm hover:shadow transition-all duration-200 overflow-hidden border-l-2 ${
                  review.rating >= 4 ? "border-green-400" :
                  review.rating >= 3 ? "border-yellow-400" :
                  "border-red-400"
                }`}
              >
                <div className="p-3">
                  <div className="flex items-start gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={review.avatar} alt={review.author} />
                      <AvatarFallback className="bg-gradient-to-r from-blue-500 to-violet-500 text-white text-xs">
                        {review.author.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
                        <div>
                          <h3 className="font-semibold text-gray-800 text-sm">{review.author}</h3>
                          <div className="flex items-center mt-0.5">
                            <div className="flex mr-1">
                              {renderStars(review.rating)}
                            </div>
                            <span className="text-xs text-gray-500">{review.date}</span>
                          </div>
                        </div>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium mt-1 sm:mt-0 ${
                          review.rating >= 4 ? "bg-green-50 text-green-600" :
                          review.rating >= 3 ? "bg-yellow-50 text-yellow-600" :
                          "bg-red-50 text-red-600"
                        }`}>
                          {review.rating === 5 ? "Excelente" :
                           review.rating === 4 ? "Muy bueno" :
                           review.rating === 3 ? "Bueno" :
                           review.rating === 2 ? "Regular" : "Malo"}
                        </span>
                      </div>

                      <p className="text-gray-700 text-xs leading-snug my-1.5">{review.content}</p>

                      <div className="flex flex-wrap items-center mt-2 gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className={`h-6 px-2 rounded-full flex items-center gap-0.5 text-xs font-medium transition-all duration-150 ${
                            review.isLiked ? 'text-blue-600 bg-blue-50 shadow-sm' : 'hover:bg-blue-50 hover:text-blue-600'
                          }`}
                          onClick={() => toggleLike(review.id)}
                        >
                          <ThumbsUp size={12} />
                          <span>Útil ({review.likes})</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className={`h-6 px-2 rounded-full flex items-center gap-0.5 text-xs font-medium transition-all duration-150 ${
                            review.showComments ? 'text-blue-600 bg-blue-50 shadow-sm' : 'hover:bg-blue-50 hover:text-blue-600'
                          }`}
                          onClick={() => toggleComments(review.id)}
                        >
                          <MessageSquare size={12} />
                          <span>Comentarios ({review.comments.length})</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className={`h-6 px-2 sm:ml-auto rounded-full text-xs font-medium transition-all duration-150 ${
                            review.showReplyForm ? 'text-blue-600 bg-blue-50 shadow-sm' : 'hover:bg-blue-50 hover:text-blue-600'
                          }`}
                          onClick={() => toggleReplyForm(review.id)}
                        >
                          Responder
                        </Button>
                      </div>

                      {review.showComments && renderComments(review.id)}

                      {review.showReplyForm && (
                        <div className="mt-2 border-t border-gray-100 pt-2">
                          <div className="flex gap-1.5">
                            <Avatar className="h-6 w-6">
                              <AvatarFallback className="bg-gradient-to-r from-blue-500 to-violet-500 text-white text-xs">F</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <Textarea
                                value={replyTexts[review.id] || ''}
                                onChange={(e) => handleReplyTextChange(review.id, e.target.value)}
                                placeholder="Escribe tu respuesta..."
                                className="mb-1.5 resize-none focus:ring-blue-500 focus:border-blue-500 text-xs bg-gray-50 rounded shadow-inner"
                                rows={1}
                              />
                              <div className="flex justify-end gap-1.5">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="h-6 px-2 rounded-full text-xs font-medium border-gray-300 hover:bg-gray-100"
                                  onClick={() => toggleReplyForm(review.id)}
                                >
                                  Cancelar
                                </Button>
                                <Button
                                  size="sm"
                                  className="h-6 px-2 rounded-full bg-gradient-to-r from-blue-500 to-violet-500 hover:from-blue-600 hover:to-violet-600 text-white text-xs"
                                  onClick={() => submitReply(review.id)}
                                  disabled={!replyTexts[review.id]?.trim()}
                                >
                                  Publicar
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {visibleReviews.length < sortedReviews().length && (
            <div className="text-center mt-6">
              <Button
                variant="outline"
                className="border-blue-500 text-blue-600 hover:bg-blue-50 hover:text-blue-700 rounded-full px-4 py-2 shadow-sm text-xs h-8"
                onClick={loadMoreReviews}
              >
                Mostrar más opiniones
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
