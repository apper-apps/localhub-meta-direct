import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import businessService from "@/services/api/businessService";

function BusinessListingPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [business, setBusiness] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [reviewText, setReviewText] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('');

  useEffect(() => {
    loadBusiness();
  }, [id]);

  const loadBusiness = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await businessService.getById(id);
      setBusiness(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddReview = async () => {
    if (!reviewText.trim()) {
      toast.error('Please enter a review');
      return;
    }
    try {
      await businessService.addReview(id, {
        rating: reviewRating,
        text: reviewText,
        author: 'Current User',
        date: new Date().toISOString()
      });
      setReviewText('');
      setReviewRating(5);
      await loadBusiness();
      toast.success('Review added successfully');
    } catch (err) {
      toast.error('Failed to add review');
    }
  };

  const handleBooking = async () => {
    if (!bookingDate || !bookingTime) {
      toast.error('Please select date and time');
      return;
    }
    try {
      await businessService.createBooking(id, {
        date: bookingDate,
        time: bookingTime,
        customer: 'Current User'
      });
      setBookingDate('');
      setBookingTime('');
      toast.success('Booking created successfully');
    } catch (err) {
      toast.error('Failed to create booking');
    }
  };

  const handleCall = () => {
    if (business?.contact?.phone) {
      window.location.href = `tel:${business.contact.phone}`;
      toast.success('Opening phone dialer');
    }
  };

  const handleDirections = () => {
    if (business?.location?.coordinates) {
      const { lat, lng } = business.location.coordinates;
      window.open(`https://maps.google.com/?q=${lat},${lng}`, '_blank');
      toast.success('Opening directions');
    }
  };

  const handleBookmark = async () => {
    try {
      await businessService.toggleBookmark(id);
      toast.success('Business bookmarked');
    } catch (err) {
      toast.error('Failed to bookmark business');
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: business?.name,
        text: business?.description,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard');
    }
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadBusiness} />;
  if (!business) return <Error message="Business not found" />;

  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'Info' },
    { id: 'reviews', label: 'Reviews', icon: 'Star' },
    { id: 'menu', label: 'Menu/Services', icon: 'Menu' },
    { id: 'booking', label: 'Booking', icon: 'Calendar' },
    { id: 'photos', label: 'Photos', icon: 'Image' }
  ];

  const renderStars = (rating) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <ApperIcon
        key={i}
        name="Star"
        className={`h-4 w-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">About</h3>
              <p className="text-gray-700 mb-4">{business.description}</p>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-3">Contact Information</h4>
                  <div className="space-y-2">
                    {business.contact.phone && (
                      <div className="flex items-center gap-2">
                        <ApperIcon name="Phone" className="h-4 w-4 text-gray-400" />
                        <span className="text-sm">{business.contact.phone}</span>
                      </div>
                    )}
                    {business.contact.email && (
                      <div className="flex items-center gap-2">
                        <ApperIcon name="Mail" className="h-4 w-4 text-gray-400" />
                        <span className="text-sm">{business.contact.email}</span>
                      </div>
                    )}
                    {business.contact.website && (
                      <div className="flex items-center gap-2">
                        <ApperIcon name="Globe" className="h-4 w-4 text-gray-400" />
                        <a href={business.contact.website} target="_blank" rel="noopener noreferrer" 
                           className="text-sm text-blue-600 hover:underline">
                          Visit Website
                        </a>
                      </div>
                    )}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-3">Location & Hours</h4>
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <ApperIcon name="MapPin" className="h-4 w-4 text-gray-400 mt-0.5" />
                      <span className="text-sm">{business.location.address}</span>
                    </div>
                    {business.hours && (
                      <div className="flex items-start gap-2">
                        <ApperIcon name="Clock" className="h-4 w-4 text-gray-400 mt-0.5" />
                        <span className="text-sm">{business.hours}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          </div>
        );

      case 'reviews':
        return (
          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Reviews</h3>
              
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex">{renderStars(business.rating || 4)}</div>
                  <span className="text-sm text-gray-600">
                    {business.rating || 4}.0 ({business.reviewCount || 12} reviews)
                  </span>
                </div>
              </div>

              <div className="border-t pt-6">
                <h4 className="font-medium mb-4">Write a Review</h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Rating</label>
                    <div className="flex gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setReviewRating(i + 1)}
                          className={`p-1 ${i < reviewRating ? 'text-yellow-400' : 'text-gray-300'}`}
                        >
                          <ApperIcon name="Star" className="h-5 w-5 fill-current" />
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Review</label>
                    <textarea
                      value={reviewText}
                      onChange={(e) => setReviewText(e.target.value)}
                      className="w-full p-3 border rounded-lg resize-none"
                      rows="4"
                      placeholder="Share your experience..."
                    />
                  </div>
                  
                  <Button onClick={handleAddReview} className="gap-2">
                    <ApperIcon name="Send" className="h-4 w-4" />
                    Submit Review
                  </Button>
                </div>
              </div>

              <div className="border-t pt-6 mt-6 space-y-4">
                {(business.reviews || [
                  { id: 1, author: 'Sarah M.', rating: 5, text: 'Excellent service and quality!', date: '2024-01-15' },
                  { id: 2, author: 'John D.', rating: 4, text: 'Great experience, will come back.', date: '2024-01-10' }
                ]).map((review) => (
                  <div key={review.id} className="border-b pb-4 last:border-b-0">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                        <span className="text-xs font-medium">{review.author[0]}</span>
                      </div>
                      <div>
                        <div className="font-medium text-sm">{review.author}</div>
                        <div className="flex items-center gap-2">
                          <div className="flex">{renderStars(review.rating)}</div>
                          <span className="text-xs text-gray-500">{review.date}</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-700 ml-10">{review.text}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        );

      case 'menu':
        return (
          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">
                {business.category === 'Restaurant' ? 'Menu' : 'Services'}
              </h3>
              
              <div className="grid gap-4">
                {(business.menuItems || business.services || [
                  { id: 1, name: 'Signature Coffee', price: '$4.50', description: 'Our house blend with notes of chocolate and caramel' },
                  { id: 2, name: 'Artisan Pastries', price: '$3.25', description: 'Fresh baked daily with organic ingredients' },
                  { id: 3, name: 'Breakfast Special', price: '$12.00', description: 'Two eggs, bacon, toast, and coffee' }
                ]).map((item) => (
                  <div key={item.id} className="flex justify-between items-start p-4 border rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium">{item.name}</h4>
                      {item.description && (
                        <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                      )}
                    </div>
                    {item.price && (
                      <span className="font-semibold text-primary-600">{item.price}</span>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          </div>
        );

      case 'booking':
        return (
          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Book an Appointment</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Date</label>
                  <input
                    type="date"
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full p-3 border rounded-lg"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Time</label>
                  <select
                    value={bookingTime}
                    onChange={(e) => setBookingTime(e.target.value)}
                    className="w-full p-3 border rounded-lg"
                  >
                    <option value="">Select a time</option>
                    <option value="09:00">9:00 AM</option>
                    <option value="10:00">10:00 AM</option>
                    <option value="11:00">11:00 AM</option>
                    <option value="14:00">2:00 PM</option>
                    <option value="15:00">3:00 PM</option>
                    <option value="16:00">4:00 PM</option>
                  </select>
                </div>
                
                <Button onClick={handleBooking} className="w-full gap-2">
                  <ApperIcon name="Calendar" className="h-4 w-4" />
                  Book Appointment
                </Button>
              </div>
              
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <div className="flex gap-2">
                  <ApperIcon name="Info" className="h-4 w-4 text-blue-600 mt-0.5" />
                  <div className="text-sm text-blue-800">
                    <p className="font-medium">Booking Policy</p>
                    <p>Please arrive 10 minutes early. Cancellations require 24-hour notice.</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        );

      case 'photos':
        return (
          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Photos</h3>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="aspect-square bg-gray-200 rounded-lg flex items-center justify-center">
                    <ApperIcon name="Image" className="h-8 w-8 text-gray-400" />
                  </div>
                ))}
              </div>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <Card className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(-1)}
              className="gap-2"
            >
              <ApperIcon name="ArrowLeft" className="h-4 w-4" />
              Back
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{business.name}</h1>
              <div className="flex items-center gap-2 mb-2">
                <div className="flex">{renderStars(business.rating || 4)}</div>
                <span className="text-sm text-gray-600">
                  {business.rating || 4}.0 ({business.reviewCount || 12} reviews)
                </span>
                <Badge variant="outline">{business.category}</Badge>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <ApperIcon name="MapPin" className="h-4 w-4" />
                <span>{business.location.city}, {business.location.state}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3">
          <Button onClick={handleCall} className="gap-2">
            <ApperIcon name="Phone" className="h-4 w-4" />
            Call
          </Button>
          <Button variant="outline" onClick={handleDirections} className="gap-2">
            <ApperIcon name="Navigation" className="h-4 w-4" />
            Directions
          </Button>
          <Button variant="outline" onClick={handleBookmark} className="gap-2">
            <ApperIcon name="Bookmark" className="h-4 w-4" />
            Save
          </Button>
          <Button variant="outline" onClick={handleShare} className="gap-2">
            <ApperIcon name="Share" className="h-4 w-4" />
            Share
          </Button>
        </div>

        {/* Tabs */}
        <div className="mt-6 border-t pt-4">
          <div className="flex overflow-x-auto gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? 'bg-primary-50 text-primary-700 border border-primary-200'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <ApperIcon name={tab.icon} className="h-4 w-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Tab Content */}
      {renderTabContent()}
    </div>
  );
}

export default BusinessListingPage;