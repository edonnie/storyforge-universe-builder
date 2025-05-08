
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '../components/Layout';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Edit, ArrowRight, Check, PlusCircle } from 'lucide-react';
import { fetchWorldById, updateWorld, TimelineEvent, fetchEntitiesByWorldId, EntityType } from '../utils/worldUtils';
import { useToast } from "@/hooks/use-toast";

const WorldDetail = () => {
  const { worldId } = useParams<{ worldId: string }>();
  const [editMode, setEditMode] = useState(false);
  const [synopsis, setSynopsis] = useState('');
  const [world, setWorld] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [timeline, setTimeline] = useState<TimelineEvent[]>([]);
  const [newYear, setNewYear] = useState('');
  const [newEvent, setNewEvent] = useState('');
  const [showNewEventForm, setShowNewEventForm] = useState(false);
  const [activeTab, setActiveTab] = useState('realms');
  const [entities, setEntities] = useState<Record<string, any[]>>({
    realms: [],
    locations: [],
    factions: [],
    characters: [],
    items: []
  });
  const { toast } = useToast();
  
  useEffect(() => {
    const loadWorld = async () => {
      if (!worldId) return;
      
      setLoading(true);
      try {
        const worldData = await fetchWorldById(worldId);
        if (worldData) {
          setWorld(worldData);
          setSynopsis(worldData.synopsis || '');
          setTimeline(worldData.timeline || []);
        }
      } catch (error) {
        console.error('Failed to load world:', error);
        toast({
          title: "Error",
          description: "Failed to load world data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadWorld();
  }, [worldId, toast]);
  
  useEffect(() => {
    const loadEntities = async () => {
      if (!worldId) return;
      
      try {
        const types: EntityType[] = ['realm', 'location', 'faction', 'character', 'item'];
        
        const entityPromises = types.map(type => 
          fetchEntitiesByWorldId(worldId, type)
        );
        
        const [realms, locations, factions, characters, items] = await Promise.all(entityPromises);
        
        setEntities({
          realms,
          locations,
          factions,
          characters,
          items
        });
      } catch (error) {
        console.error('Failed to load entities:', error);
      }
    };
    
    loadEntities();
  }, [worldId]);
  
  const handleSaveChanges = async () => {
    if (!worldId) return;
    
    try {
      await updateWorld(worldId, { synopsis });
      setEditMode(false);
      toast({
        title: "Success",
        description: "Synopsis updated successfully",
      });
    } catch (error) {
      console.error('Failed to update world:', error);
      toast({
        title: "Error",
        description: "Failed to save changes",
        variant: "destructive",
      });
    }
  };
  
  const handleAddTimelineEvent = async () => {
    if (!worldId || !newYear.trim() || !newEvent.trim()) return;
    
    try {
      const newEventObj = {
        id: Math.random().toString(36).substr(2, 9),
        year: newYear,
        description: newEvent,
        createdAt: new Date().toISOString()
      };
      
      const updatedTimeline = [...timeline, newEventObj];
      await updateWorld(worldId, { timeline: updatedTimeline });
      
      setTimeline(updatedTimeline);
      setNewYear('');
      setNewEvent('');
      setShowNewEventForm(false);
      
      toast({
        title: "Success",
        description: "Timeline event added",
      });
    } catch (error) {
      console.error('Failed to add timeline event:', error);
      toast({
        title: "Error",
        description: "Failed to add timeline event",
        variant: "destructive",
      });
    }
  };
  
  if (loading) {
    return (
      <Layout>
        <div className="text-center py-12">
          <p>Loading world details...</p>
        </div>
      </Layout>
    );
  }
  
  if (!world) {
    return (
      <Layout>
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-4">World Not Found</h1>
          <p className="mb-6">The world you're looking for doesn't exist.</p>
          <Button onClick={() => window.location.href = '/dashboard'}>
            Return to Dashboard
          </Button>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-3xl font-bold">{world.name}</h1>
        <Button onClick={() => window.location.href = '/dashboard'} variant="outline">
          Back to Dashboard
        </Button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - World Synopsis and Timeline */}
        <div className="lg:col-span-1 space-y-6">
          {/* World Synopsis */}
          <Card className="bg-card">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>World Synopsis</CardTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setEditMode(!editMode)}
              >
                {editMode ? <Check size={18} /> : <Edit size={18} />}
              </Button>
            </CardHeader>
            <CardContent>
              {editMode ? (
                <div className="space-y-4">
                  <Textarea
                    value={synopsis}
                    onChange={(e) => setSynopsis(e.target.value)}
                    className="w-full min-h-[150px] resize-none"
                    placeholder="Describe your world here..."
                  />
                  <Button onClick={handleSaveChanges}>Save Changes</Button>
                </div>
              ) : (
                <p>{synopsis || 'No synopsis available.'}</p>
              )}
            </CardContent>
          </Card>
          
          {/* Timeline */}
          <Card className="bg-card">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Timeline</CardTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowNewEventForm(!showNewEventForm)}
              >
                <PlusCircle size={18} />
              </Button>
            </CardHeader>
            <CardContent>
              {showNewEventForm && (
                <div className="mb-6 p-4 border border-muted rounded-md space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Year</label>
                    <Input
                      value={newYear}
                      onChange={(e) => setNewYear(e.target.value)}
                      placeholder="e.g., 1024"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Event</label>
                    <Textarea
                      value={newEvent}
                      onChange={(e) => setNewEvent(e.target.value)}
                      placeholder="Describe the event"
                      rows={3}
                    />
                  </div>
                  <div className="flex space-x-2">
                    <Button onClick={handleAddTimelineEvent}>Add Event</Button>
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setShowNewEventForm(false);
                        setNewYear('');
                        setNewEvent('');
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
              
              {timeline && timeline.length > 0 ? (
                <div className="space-y-4">
                  <div className="relative">
                    {timeline.sort((a, b) => parseInt(a.year) - parseInt(b.year)).map((event, index) => (
                      <div key={event.id} className="relative pl-8 pb-8">
                        {/* Timeline line */}
                        {index < timeline.length - 1 && (
                          <div className="absolute left-3 top-6 bottom-0 w-0.5 bg-muted"></div>
                        )}
                        {/* Timeline dot */}
                        <div className="absolute left-0 top-1.5 w-6 h-6 rounded-full bg-primary flex items-center justify-center text-xs font-bold">
                          {index + 1}
                        </div>
                        {/* Event content */}
                        <div>
                          <h4 className="font-bold text-lg">{event.year}</h4>
                          <p className="mt-1 text-muted-foreground">{event.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-4">
                  No timeline events yet. Click the + button to add one.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
        
        {/* Right Column - Entity Tabs */}
        <div className="lg:col-span-2">
          <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-5 mb-4">
              <TabsTrigger value="realms">Realms</TabsTrigger>
              <TabsTrigger value="locations">Locations</TabsTrigger>
              <TabsTrigger value="factions">Factions</TabsTrigger>
              <TabsTrigger value="characters">Characters</TabsTrigger>
              <TabsTrigger value="items">Items</TabsTrigger>
            </TabsList>
            
            {/* Realms Tab */}
            <TabsContent value="realms" className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Realms</h2>
                <Button size="sm" onClick={() => window.location.href = `/worlds/${worldId}/realms/create`}>
                  <Plus size={16} className="mr-2" /> Add Realm
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[500px] overflow-y-auto">
                {entities.realms.length > 0 ? (
                  entities.realms.map(realm => (
                    <Card key={realm.id} className="bg-card hover:bg-card/80 transition-colors">
                      <CardHeader className="p-4 pb-2">
                        <CardTitle className="text-lg">{realm.name}</CardTitle>
                      </CardHeader>
                      <CardContent className="p-4">
                        <p className="text-sm text-muted-foreground mb-4">
                          {realm.details.description}
                        </p>
                        <Button variant="ghost" className="w-full justify-between">
                          <span>View Details</span>
                          <ArrowRight size={16} />
                        </Button>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <p className="text-muted-foreground col-span-2 text-center py-8">
                    No realms created yet. Click "Add Realm" to create one.
                  </p>
                )}
              </div>
            </TabsContent>
            
            {/* Locations Tab */}
            <TabsContent value="locations" className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Locations</h2>
                <Button size="sm" onClick={() => window.location.href = `/worlds/${worldId}/locations/create`}>
                  <Plus size={16} className="mr-2" /> Add Location
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[500px] overflow-y-auto">
                {entities.locations.length > 0 ? (
                  entities.locations.map(location => (
                    <Card key={location.id} className="bg-card hover:bg-card/80 transition-colors">
                      <CardHeader className="p-4 pb-2">
                        <CardTitle className="text-lg">{location.name}</CardTitle>
                      </CardHeader>
                      <CardContent className="p-4">
                        <p className="text-sm text-muted-foreground mb-4">
                          {location.details.description}
                        </p>
                        <Button variant="ghost" className="w-full justify-between">
                          <span>View Details</span>
                          <ArrowRight size={16} />
                        </Button>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <p className="text-muted-foreground col-span-2 text-center py-8">
                    No locations created yet. Click "Add Location" to create one.
                  </p>
                )}
              </div>
            </TabsContent>
            
            {/* Factions Tab */}
            <TabsContent value="factions" className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Factions</h2>
                <Button size="sm" onClick={() => window.location.href = `/worlds/${worldId}/factions/create`}>
                  <Plus size={16} className="mr-2" /> Add Faction
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[500px] overflow-y-auto">
                {entities.factions.length > 0 ? (
                  entities.factions.map(faction => (
                    <Card key={faction.id} className="bg-card hover:bg-card/80 transition-colors">
                      <CardHeader className="p-4 pb-2">
                        <CardTitle className="text-lg">{faction.name}</CardTitle>
                      </CardHeader>
                      <CardContent className="p-4">
                        <p className="text-sm text-muted-foreground mb-4">
                          {faction.details.description}
                        </p>
                        <Button variant="ghost" className="w-full justify-between">
                          <span>View Details</span>
                          <ArrowRight size={16} />
                        </Button>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <p className="text-muted-foreground col-span-2 text-center py-8">
                    No factions created yet. Click "Add Faction" to create one.
                  </p>
                )}
              </div>
            </TabsContent>
            
            {/* Characters Tab */}
            <TabsContent value="characters" className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Characters</h2>
                <Button 
                  size="sm" 
                  onClick={() => window.location.href = `/worlds/${worldId}/characters/create`}
                >
                  <Plus size={16} className="mr-2" /> Add Character
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[500px] overflow-y-auto">
                {entities.characters.length > 0 ? (
                  entities.characters.map(character => (
                    <Card key={character.id} className="bg-card hover:bg-card/80 transition-colors">
                      <CardHeader className="p-4 pb-2">
                        <CardTitle className="text-lg">{character.name}</CardTitle>
                      </CardHeader>
                      <CardContent className="p-4">
                        <div className="flex space-x-4 mb-3">
                          <span className="text-xs px-2 py-1 bg-muted rounded-full">
                            {character.details.race}
                          </span>
                          <span className="text-xs px-2 py-1 bg-muted rounded-full">
                            {character.details.role}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-4">
                          {character.details.description}
                        </p>
                        <Button variant="ghost" className="w-full justify-between">
                          <span>View Details</span>
                          <ArrowRight size={16} />
                        </Button>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <p className="text-muted-foreground col-span-2 text-center py-8">
                    No characters created yet. Click "Add Character" to create one.
                  </p>
                )}
              </div>
            </TabsContent>
            
            {/* Items Tab */}
            <TabsContent value="items" className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Items</h2>
                <Button size="sm" onClick={() => window.location.href = `/worlds/${worldId}/items/create`}>
                  <Plus size={16} className="mr-2" /> Add Item
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[500px] overflow-y-auto">
                {entities.items.length > 0 ? (
                  entities.items.map(item => (
                    <Card key={item.id} className="bg-card hover:bg-card/80 transition-colors">
                      <CardHeader className="p-4 pb-2">
                        <CardTitle className="text-lg">{item.name}</CardTitle>
                      </CardHeader>
                      <CardContent className="p-4">
                        <div className="flex mb-3">
                          <span className="text-xs px-2 py-1 bg-muted rounded-full">
                            {item.details.type}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-4">
                          {item.details.description}
                        </p>
                        <Button variant="ghost" className="w-full justify-between">
                          <span>View Details</span>
                          <ArrowRight size={16} />
                        </Button>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <p className="text-muted-foreground col-span-2 text-center py-8">
                    No items created yet. Click "Add Item" to create one.
                  </p>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default WorldDetail;
