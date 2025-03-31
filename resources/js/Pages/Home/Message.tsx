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
import { Star, StarHalf, ThumbsUp, MessageSquare } from "lucide-react";

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
  const [visibleReviews, setVisibleReviews] = useState<Review[]>(reviews.slice(0, 3));
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
      id: `${reviewId}-${reviews.find(review => review.id === reviewId)?.comments.length }`,
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
      stars.push(<Star key={`star-${i}`} className="fill-yellow-400 text-yellow-400" size={16} />);
    }

    if (hasHalfStar) {
      stars.push(<StarHalf key="half-star" className="fill-yellow-400 text-yellow-400" size={16} />);
    }

    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-star-${i}`} className="text-gray-300" size={16} />);
    }

    return stars;
  };

  const renderRatingStars = () => {
    return Array.from({ length: 5 }).map((_, index) => (
      <Star
        key={`rating-star-${index}`}
        className={index < selectedRating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
        size={24}
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
    const remainingReviews = reviews.slice(visibleReviews.length, visibleReviews.length + 3);
    setVisibleReviews([...visibleReviews, ...remainingReviews]);
  };

  const renderComments = (reviewId: string) => {
    const comments = reviews.find(review => review.id === reviewId)?.comments || [];

    return (
      <div className="mt-3">
        {comments.map(comment => (
          <div key={comment.id} className="flex gap-2 items-start mb-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150" alt={comment.author} />
              <AvatarFallback>{comment.author.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <h4 className="font-medium">{comment.author}</h4>
              <p className="text-sm">{comment.content}</p>
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

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Opiniones de Clientes</h1>
            <div className="flex items-center gap-2">
              <div className="flex">
                {renderStars(4.5)}
              </div>
              <span className="text-muted-foreground">4.5 de 5 (256 opiniones)</span>
            </div>
          </div>

          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="mt-4 md:mt-0">
                Escribir Opinión
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Escribir una opinión</DialogTitle>
                <DialogDescription>
                  Comparta su experiencia con nuestros productos y servicios.
                </DialogDescription>
              </DialogHeader>

              <div className="py-4">
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Su calificación</label>
                  <div className="flex gap-1">
                    {renderRatingStars()}
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Su opinión</label>
                  <Textarea
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    rows={4}
                    placeholder="Escriba su opinión aquí..."
                  />
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={submitReview} disabled={selectedRating === 0 || !reviewText.trim()}>
                  Publicar opinión
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <Card className="p-4 mb-6">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="w-full md:w-1/3">
              <Select value={sortOption} onValueChange={setSortOption}>
                <SelectTrigger>
                  <SelectValue placeholder="Ordenar por" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">Ordenar por más recientes</SelectItem>
                  <SelectItem value="rating">Ordenar por calificación</SelectItem>
                  <SelectItem value="relevance">Ordenar por relevancia</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="w-full md:w-2/3 flex flex-wrap gap-2">
              <Button variant="outline" className="rounded-full" onClick={() => setFilteredRating(5)}>
                5 estrellas ({ratingCounts[5]})
              </Button>
              <Button variant="outline" className="rounded-full" onClick={() => setFilteredRating(4)}>
                4 estrellas ({ratingCounts[4]})
              </Button>
              <Button variant="outline" className="rounded-full" onClick={() => setFilteredRating(3)}>
                3 estrellas ({ratingCounts[3]})
              </Button>
              <Button variant="outline" className="rounded-full" onClick={() => setFilteredRating(2)}>
                2 estrellas ({ratingCounts[2]})
              </Button>
              <Button variant="outline" className="rounded-full" onClick={() => setFilteredRating(1)}>
                1 estrella ({ratingCounts[1]})
              </Button>
              <Button variant="outline" className="rounded-full" onClick={() => setFilteredRating(null)}>
                Ver todas
              </Button>
            </div>
          </div>
        </Card>

        <div className="space-y-6">
          {sortedReviews().slice(0, visibleReviews.length).map((review) => (
            <Card key={review.id} className="p-4 transition-transform hover:-translate-y-1">
              <div className="flex gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={review.avatar} alt={review.author} />
                  <AvatarFallback>{review.author.charAt(0)}</AvatarFallback>
                </Avatar>

                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{review.author}</h3>
                      <div className="flex my-1">
                        {renderStars(review.rating)}
                      </div>
                    </div>
                    <span className="text-sm text-muted-foreground">{review.date}</span>
                  </div>

                  <p className="my-3">{review.content}</p>

                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className={`flex items-center gap-1 ${review.isLiked ? 'text-blue-500' : ''}`}
                      onClick={() => toggleLike(review.id)}
                    >
                      <ThumbsUp size={16} /> Útil ({review.likes})
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex items-center gap-1"
                      onClick={() => toggleComments(review.id)}
                    >
                      <MessageSquare size={16} /> Comentarios ({review.comments.length})
                    </Button>
                  </div>

                  <div className="mt-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleReplyForm(review.id)}
                    >
                      Responder
                    </Button>

                    {review.showReplyForm && (
                      <div className="mt-3">
                        <Textarea
                          value={replyTexts[review.id] || ''}
                          onChange={(e) => handleReplyTextChange(review.id, e.target.value)}
                          placeholder="Escribe tu respuesta..."
                          className="mb-2"
                          rows={2}
                        />
                        <Button
                          size="sm"
                          onClick={() => submitReply(review.id)}
                          disabled={!replyTexts[review.id]?.trim()}
                        >
                          Enviar
                        </Button>
                      </div>
                    )}

                    {review.showComments && renderComments(review.id)}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {visibleReviews.length < reviews.length && (
          <div className="text-center mt-8">
            <Button variant="outline" size="lg" className="px-8" onClick={loadMoreReviews}>
              Cargar más opiniones
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;