import React, { useState, useRef } from 'react';
import { useNavigate, Navigate, Link } from 'react-router-dom';
import { useAuth } from '@/lib/authContext';
import { useComplaints } from '@/lib/complaintsContext';
import { demoWards } from '@/lib/mockData';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { ArrowLeft, MapPin, Camera, Trash2, Droplets, Construction, Lightbulb } from 'lucide-react';
import { cn } from '@/lib/utils';

const categories = [
  { id: 'garbage', label: 'Garbage', icon: Trash2, description: 'Waste accumulation, dumping' },
  { id: 'drainage', label: 'Drainage', icon: Droplets, description: 'Blocked drains, sewage' },
  { id: 'road', label: 'Road', icon: Construction, description: 'Potholes, damaged roads' },
  { id: 'streetlight', label: 'Streetlight', icon: Lightbulb, description: 'Non-functional lights' },
  { id: 'water', label: 'Water Supply', icon: Droplets, description: 'No water, low pressure' },
  { id: 'trees', label: 'Trees', icon: Trash2, description: 'Fallen trees, trimming required' },
  { id: 'sanitation', label: 'Sanitation', icon: Trash2, description: 'Public toilet issues, hygiene' },
] as const;

export default function NewComplaint() {
  const { user, isAuthenticated } = useAuth();
  const { addComplaint } = useComplaints();
  const navigate = useNavigate();

  const [category, setCategory] = useState<string>('');
  const [description, setDescription] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  
  const [address, setAddress] = useState('');
  const [wardId, setWardId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Demo GPS coordinates
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role !== 'citizen') {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!category || !description || (!selectedFile && !previewUrl) || !address || !wardId) {
      toast({
        title: 'Missing Fields',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const title = `${category} - ${address}`;
      const fullDescription = `${description}\n\nAddress: ${address}\nWard: ${wardId}`;

      const form = new FormData();
      form.append('title', title);
      form.append('description', fullDescription);
      form.append('category', category);
      form.append('address', address);
      if (selectedFile) form.append('file', selectedFile);

      const res = await fetch('/api/complaints', {
        method: 'POST',
        body: form,
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Server returned ${res.status}`);
      }

      const created = await res.json();

      const selectedWard = demoWards.find(w => w.id === wardId);

      addComplaint({
        citizenId: user.id,
        citizenName: user.name,
        category: category as string,
        description: fullDescription,
        imageUrl: created?.image_path || previewUrl,
        latitude: latitude ?? 0,
        longitude: longitude ?? 0,
        address,
        wardId,
        wardName: selectedWard?.name || 'Unknown Ward',
        status: created?.status || 'open',
      });

      toast({ title: 'Complaint Submitted', description: 'Your complaint has been registered successfully.' });
      navigate('/complaints');
    } catch (err: any) {
      toast({ title: 'Submission Failed', description: String(err.message || err), variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // handle file selection and preview
  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    setSelectedFile(f);
    if (f) {
      const url = URL.createObjectURL(f);
      setPreviewUrl(url);
    } else {
      setPreviewUrl('');
    }
  };

  // attempt to detect location via browser geolocation and reverse-geocode using Nominatim
  const detectLocation = async () => {
    if (!navigator.geolocation) {
      toast({ title: 'Geolocation unsupported', description: 'Your browser does not support geolocation', variant: 'destructive' });
      return;
    }

    navigator.geolocation.getCurrentPosition(async (pos) => {
      const lat = pos.coords.latitude;
      const lon = pos.coords.longitude;
      setLatitude(lat);
      setLongitude(lon);

      try {
        const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`;
        const r = await fetch(url);
        if (!r.ok) throw new Error('Reverse geocoding failed');
        const data = await r.json();
        const display = data.display_name || `${lat.toFixed(6)}, ${lon.toFixed(6)}`;
        setAddress(display);
      } catch (err) {
        setAddress(`${lat.toFixed(6)}, ${lon.toFixed(6)}`);
      }
    }, (err) => {
      toast({ title: 'Location Error', description: err.message || 'Unable to get location', variant: 'destructive' });
    });
  };

  

  return (
    <Layout>
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Back Button */}
        <Link to="/complaints">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Complaints
          </Button>
        </Link>

        <Card>
          <CardHeader>
            <CardTitle>Submit New Complaint</CardTitle>
            <CardDescription>
              Report a civic issue in your area. Please provide accurate details to help us resolve it faster.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Category Selection */}
              <div className="space-y-3">
                <Label>Category *</Label>
                <div className="grid grid-cols-2 gap-3">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setCategory(cat.id)}
                      className={cn(
                        "flex items-start gap-3 p-4 rounded-lg border-2 text-left transition-all",
                        category === cat.id
                          ? "border-accent bg-accent/10"
                          : "border-border hover:border-muted-foreground/30"
                      )}
                    >
                      <div className={cn(
                        "flex h-10 w-10 items-center justify-center rounded-lg",
                        category === cat.id ? "bg-accent text-accent-foreground" : "bg-muted"
                      )}>
                        <cat.icon className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{cat.label}</p>
                        <p className="text-xs text-muted-foreground">{cat.description}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <div className="relative">
                  <Textarea
                    id="description"
                    placeholder="Describe the issue in detail..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                  />
                  
                </div>
                
              </div>

              {/* Image Upload */}
              <div className="space-y-2">
                <Label htmlFor="image">Image (upload) *</Label>
                <div className="flex items-center gap-3">
                  <input id="image" type="file" accept="image/*" onChange={onFileChange} />
                </div>
                <p className="text-xs text-muted-foreground">Upload a photo of the issue from your device.</p>
                {previewUrl && (
                  <div className="mt-2 rounded-lg overflow-hidden border border-border h-48">
                    <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              {/* Address with auto-detect */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="address">Address *</Label>
                  <Button type="button" variant="ghost" size="sm" onClick={detectLocation}>Detect Location</Button>
                </div>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="address"
                    placeholder="Enter the location address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>

              {/* Ward Selection */}
              <div className="space-y-2">
                <Label>Ward *</Label>
                <Select value={wardId} onValueChange={setWardId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select ward" />
                  </SelectTrigger>
                  <SelectContent>
                    {demoWards.map((ward) => (
                      <SelectItem key={ward.id} value={ward.id}>
                        {ward.name} - Officer: {ward.officerName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* GPS Coordinates (Auto-filled) */}
              <div className="p-4 rounded-lg bg-muted/50 border border-border">
                <p className="text-sm font-medium text-foreground mb-2">GPS Coordinates (Auto-detected)</p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                        <p className="text-xs text-muted-foreground">Latitude</p>
                        <p className="font-mono text-foreground">{latitude ? latitude.toFixed(6) : '—'}</p>
                  </div>
                  <div>
                        <p className="text-xs text-muted-foreground">Longitude</p>
                        <p className="font-mono text-foreground">{longitude ? longitude.toFixed(6) : '—'}</p>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex gap-3 pt-4">
                <Link to="/complaints" className="flex-1">
                  <Button type="button" variant="outline" className="w-full">
                    Cancel
                  </Button>
                </Link>
                <Button
                  type="submit"
                  className="flex-1 gradient-accent text-accent-foreground"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Complaint'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
