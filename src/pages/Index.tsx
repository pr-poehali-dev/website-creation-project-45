import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

interface Review {
  id: number;
  author: string;
  rating: number;
  comment: string;
  date: string;
}

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  rating: number;
  reviewsCount: number;
  reviews: Review[];
}

const Index = () => {
  const { toast } = useToast();
  const [cart, setCart] = useState<Array<{ product: Product; quantity: number }>>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [reviewForm, setReviewForm] = useState({ author: '', rating: 5, comment: '' });
  const [selectedCategory, setSelectedCategory] = useState<string>('Все');

  const [products, setProducts] = useState<Product[]>([
    {
      id: 1,
      name: 'Беспроводные наушники',
      price: 4990,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80',
      category: 'Электроника',
      rating: 4.5,
      reviewsCount: 24,
      reviews: [
        { id: 1, author: 'Анна', rating: 5, comment: 'Отличное качество звука!', date: '2024-10-10' },
        { id: 2, author: 'Иван', rating: 4, comment: 'Хорошие наушники, но немного жмут', date: '2024-10-08' }
      ]
    },
    {
      id: 2,
      name: 'Умные часы',
      price: 8990,
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80',
      category: 'Электроника',
      rating: 4.8,
      reviewsCount: 42,
      reviews: [
        { id: 1, author: 'Мария', rating: 5, comment: 'Супер! Все функции работают идеально', date: '2024-10-12' }
      ]
    },
    {
      id: 3,
      name: 'Рюкзак городской',
      price: 2990,
      image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&q=80',
      category: 'Аксессуары',
      rating: 4.3,
      reviewsCount: 18,
      reviews: [
        { id: 1, author: 'Петр', rating: 4, comment: 'Вместительный и удобный', date: '2024-10-11' }
      ]
    },
    {
      id: 4,
      name: 'Портативная колонка',
      price: 3490,
      image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500&q=80',
      category: 'Электроника',
      rating: 4.6,
      reviewsCount: 31,
      reviews: [
        { id: 1, author: 'Ольга', rating: 5, comment: 'Звук просто бомба!', date: '2024-10-09' }
      ]
    },
    {
      id: 5,
      name: 'Солнцезащитные очки',
      price: 1990,
      image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500&q=80',
      category: 'Аксессуары',
      rating: 4.4,
      reviewsCount: 15,
      reviews: []
    },
    {
      id: 6,
      name: 'Термокружка',
      price: 890,
      image: 'https://images.unsplash.com/photo-1534695215-b3caaa789588?w=500&q=80',
      category: 'Товары для дома',
      rating: 4.7,
      reviewsCount: 28,
      reviews: [
        { id: 1, author: 'Дмитрий', rating: 5, comment: 'Держит тепло 8 часов!', date: '2024-10-13' }
      ]
    }
  ]);

  const categories = ['Все', 'Электроника', 'Аксессуары', 'Товары для дома'];

  const filteredProducts = selectedCategory === 'Все' 
    ? products 
    : products.filter(p => p.category === selectedCategory);

  const addToCart = (product: Product) => {
    const existingItem = cart.find(item => item.product.id === product.id);
    if (existingItem) {
      setCart(cart.map(item => 
        item.product.id === product.id 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { product, quantity: 1 }]);
    }
    toast({
      title: 'Товар добавлен в корзину',
      description: product.name,
    });
  };

  const removeFromCart = (productId: number) => {
    setCart(cart.filter(item => item.product.id !== productId));
  };

  const updateQuantity = (productId: number, delta: number) => {
    setCart(cart.map(item => {
      if (item.product.id === productId) {
        const newQuantity = item.quantity + delta;
        return newQuantity > 0 ? { ...item, quantity: newQuantity } : item;
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const totalPrice = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const submitReview = () => {
    if (!selectedProduct || !reviewForm.author.trim() || !reviewForm.comment.trim()) {
      toast({
        title: 'Ошибка',
        description: 'Заполните все поля',
        variant: 'destructive'
      });
      return;
    }

    const newReview: Review = {
      id: Date.now(),
      author: reviewForm.author,
      rating: reviewForm.rating,
      comment: reviewForm.comment,
      date: new Date().toISOString().split('T')[0]
    };

    setProducts(products.map(p => 
      p.id === selectedProduct.id 
        ? { 
            ...p, 
            reviews: [...p.reviews, newReview],
            reviewsCount: p.reviewsCount + 1,
            rating: ((p.rating * p.reviewsCount) + reviewForm.rating) / (p.reviewsCount + 1)
          }
        : p
    ));

    setReviewForm({ author: '', rating: 5, comment: '' });
    toast({
      title: 'Спасибо за отзыв!',
      description: 'Ваш отзыв успешно добавлен',
    });
  };

  const StarRating = ({ rating, onRate }: { rating: number; onRate?: (rating: number) => void }) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => onRate?.(star)}
            className={`${onRate ? 'cursor-pointer hover:scale-110' : ''} transition-transform`}
            disabled={!onRate}
          >
            <Icon 
              name={star <= rating ? 'Star' : 'Star'} 
              size={18} 
              className={star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
            />
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Icon name="Store" size={32} className="text-primary" />
              <h1 className="text-2xl font-bold text-foreground">ShopHub</h1>
            </div>
            
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="lg" className="relative">
                  <Icon name="ShoppingCart" size={20} />
                  {cart.length > 0 && (
                    <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs">
                      {cart.reduce((sum, item) => sum + item.quantity, 0)}
                    </Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent className="w-full sm:max-w-md">
                <SheetHeader>
                  <SheetTitle>Корзина</SheetTitle>
                </SheetHeader>
                <div className="mt-6 space-y-4">
                  {cart.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">Корзина пуста</p>
                  ) : (
                    <>
                      {cart.map(item => (
                        <div key={item.product.id} className="flex gap-4 items-center border-b pb-4">
                          <img 
                            src={item.product.image} 
                            alt={item.product.name}
                            className="w-16 h-16 object-cover rounded"
                          />
                          <div className="flex-1">
                            <h4 className="font-medium">{item.product.name}</h4>
                            <p className="text-sm text-muted-foreground">{item.product.price} ₽</p>
                            <div className="flex items-center gap-2 mt-2">
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => updateQuantity(item.product.id, -1)}
                              >
                                <Icon name="Minus" size={14} />
                              </Button>
                              <span className="w-8 text-center">{item.quantity}</span>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => updateQuantity(item.product.id, 1)}
                              >
                                <Icon name="Plus" size={14} />
                              </Button>
                            </div>
                          </div>
                          <Button 
                            size="sm" 
                            variant="ghost"
                            onClick={() => removeFromCart(item.product.id)}
                          >
                            <Icon name="Trash2" size={16} />
                          </Button>
                        </div>
                      ))}
                      <div className="pt-4 border-t">
                        <div className="flex justify-between items-center mb-4">
                          <span className="text-lg font-semibold">Итого:</span>
                          <span className="text-2xl font-bold text-primary">{totalPrice.toLocaleString()} ₽</span>
                        </div>
                        <Button className="w-full" size="lg">
                          Оформить заказ
                          <Icon name="ArrowRight" size={18} />
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-6">Каталог товаров</h2>
          <div className="flex gap-2 flex-wrap">
            {categories.map(category => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map(product => (
            <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <CardHeader className="p-0">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-64 object-cover"
                />
              </CardHeader>
              <CardContent className="p-4">
                <Badge variant="secondary" className="mb-2">{product.category}</Badge>
                <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
                <div className="flex items-center gap-2 mb-3">
                  <StarRating rating={product.rating} />
                  <span className="text-sm text-muted-foreground">
                    {product.rating.toFixed(1)} ({product.reviewsCount})
                  </span>
                </div>
                <p className="text-2xl font-bold text-primary mb-4">{product.price.toLocaleString()} ₽</p>
              </CardContent>
              <CardFooter className="p-4 pt-0 gap-2">
                <Button 
                  className="flex-1" 
                  onClick={() => addToCart(product)}
                >
                  <Icon name="ShoppingCart" size={18} />
                  В корзину
                </Button>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button 
                      variant="outline"
                      onClick={() => setSelectedProduct(product)}
                    >
                      <Icon name="MessageSquare" size={18} />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>{product.name}</DialogTitle>
                      <DialogDescription>
                        Отзывы и рейтинги ({product.reviewsCount})
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="space-y-6">
                      <div className="flex items-center gap-4">
                        <div className="text-center">
                          <div className="text-4xl font-bold">{product.rating.toFixed(1)}</div>
                          <StarRating rating={product.rating} />
                          <div className="text-sm text-muted-foreground mt-1">
                            {product.reviewsCount} отзывов
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h4 className="font-semibold">Отзывы покупателей</h4>
                        {product.reviews.length === 0 ? (
                          <p className="text-muted-foreground">Пока нет отзывов</p>
                        ) : (
                          product.reviews.map(review => (
                            <div key={review.id} className="border-b pb-4">
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <span className="font-medium">{review.author}</span>
                                  <StarRating rating={review.rating} />
                                </div>
                                <span className="text-sm text-muted-foreground">{review.date}</span>
                              </div>
                              <p className="text-sm">{review.comment}</p>
                            </div>
                          ))
                        )}
                      </div>

                      <div className="space-y-4 border-t pt-4">
                        <h4 className="font-semibold">Оставить отзыв</h4>
                        <div className="space-y-3">
                          <div>
                            <Label>Ваше имя</Label>
                            <Input 
                              value={reviewForm.author}
                              onChange={(e) => setReviewForm({...reviewForm, author: e.target.value})}
                              placeholder="Введите ваше имя"
                            />
                          </div>
                          <div>
                            <Label>Рейтинг</Label>
                            <div className="mt-2">
                              <StarRating 
                                rating={reviewForm.rating}
                                onRate={(rating) => setReviewForm({...reviewForm, rating})}
                              />
                            </div>
                          </div>
                          <div>
                            <Label>Отзыв</Label>
                            <Textarea 
                              value={reviewForm.comment}
                              onChange={(e) => setReviewForm({...reviewForm, comment: e.target.value})}
                              placeholder="Поделитесь своим мнением о товаре"
                              rows={4}
                            />
                          </div>
                          <Button onClick={submitReview} className="w-full">
                            Отправить отзыв
                          </Button>
                        </div>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardFooter>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Index;
