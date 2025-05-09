import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '../components/Layout';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, Edit, ArrowRight, Check, PlusCircle, Save, Trash } from 'lucide-react';
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
  const [editingEvent, setEditingEvent] = useState<TimelineEvent | null>(null);
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
  
  const handleEditTimelineEvent = async () => {
    if (!worldId || !editingEvent) return;
    
    try {
      const updatedTimeline = timeline.map(event => 
        event.id === editingEvent.id ? editingEvent : event
      );
      
      await updateWorld(worldId, { timeline: updatedTimeline });
      setTimeline(updatedTimeline);
      setEditingEvent(null);
      
      toast({
        title: "Success",
        description: "Timeline event updated",
      });
    } catch (error) {
      console.error('Failed to update timeline event:', error);
      toast({
        title: "Error",
        description: "Failed to update timeline event",
        variant: "destructive",
      });
    }
  };
  
  const handleDeleteTimelineEvent = async (eventId: string) => {
    if (!worldId) return;
    
    try {
      const updatedTimeline = timeline.filter(event => event.id !== eventId);
      
      await updateWorld(worldId, { timeline: updatedTimeline });
      setTimeline(updatedTimeline);
      
      toast({
        title: "Success",
        description: "Timeline event deleted",
      });
    } catch (error) {
      console.error('Failed to delete timeline event:', error);
      toast({
        title: "Error",
        description: "Failed to delete timeline event",
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
      
      {/* World Synopsis */}
      <Card className="mb-8 bg-black/40 border border-gray-800">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl">World Synopsis</CardTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setEditMode(!editMode)}
            className="text-gray-400 hover:text-white"
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
                className="w-full min-h-[150px] resize-none bg-black/40 border-gray-700"
                placeholder="Describe your world here..."
              />
              <Button 
                onClick={handleSaveChanges}
                className="bg-blue-500 hover:bg-blue-600 text-white"
              >
                Save Changes
              </Button>
            </div>
          ) : (
            <p>{synopsis || 'No synopsis available.'}</p>
          )}
        </CardContent>
      </Card>
      
      {/* Entity Tabs */}
      <div className="mb-8">
        <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-black/40 border border-gray-800 mb-4">
            <TabsTrigger value="realms" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">Realms</TabsTrigger>
            <TabsTrigger value="locations" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">Locations</TabsTrigger>
            <TabsTrigger value="factions" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">Factions</TabsTrigger>
            <TabsTrigger value="characters" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">Characters</TabsTrigger>
            <TabsTrigger value="items" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">Items</TabsTrigger>
          </TabsList>
          
          {/* Realms Tab */}
          <TabsContent value="realms" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Your Realms</h2>
              <Button 
                size="sm" 
                onClick={() => window.location.href = `/worlds/${worldId}/realms/create`}
                className="bg-blue-500 hover:bg-blue-600 text-white"
              >
                <Plus size={16} className="mr-2" /> Create Realm
              </Button>
            </div>
            
            <div className="bg-black/40 border border-gray-800 p-6 rounded-md">
              {entities.realms.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[500px] overflow-y-auto">
                  {entities.realms.map(realm => (
                    <Card key={realm.id} className="bg-black/60 hover:bg-black/80 border border-gray-700 transition-colors">
                      <CardHeader className="p-4 pb-2">
                        <CardTitle className="text-lg">{realm.name}</CardTitle>
                      </CardHeader>
                      <CardContent className="p-4">
                        <p className="text-sm text-gray-400 mb-4">
                          {realm.details.description}
                        </p>
                        <Button variant="ghost" className="w-full justify-between hover:bg-blue-500/20">
                          <span>View Details</span>
                          <ArrowRight size={16} />
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-400">No realms yet. Click "Create Realm" above to add one.</p>
                </div>
              )}
            </div>
          </TabsContent>
          
          {/* Locations Tab */}
          <TabsContent value="locations" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Your Locations</h2>
              <Button 
                size="sm" 
                onClick={() => window.location.href = `/worlds/${worldId}/locations/create`}
                className="bg-blue-500 hover:bg-blue-600 text-white"
              >
                <Plus size={16} className="mr-2" /> Create Location
              </Button>
            </div>
            
            <div className="bg-black/40 border border-gray-800 p-6 rounded-md">
              {entities.locations.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[500px] overflow-y-auto">
                  {entities.locations.map(location => (
                    <Card key={location.id} className="bg-black/60 hover:bg-black/80 border border-gray-700 transition-colors">
                      <CardHeader className="p-4 pb-2">
                        <CardTitle className="text-lg">{location.name}</CardTitle>
                      </CardHeader>
                      <CardContent className="p-4">
                        <p className="text-sm text-gray-400 mb-4">
                          {location.details.description}
                        </p>
                        <Button variant="ghost" className="w-full justify-between hover:bg-blue-500/20">
                          <span>View Details</span>
                          <ArrowRight size={16} />
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-400">No locations yet. Click "Create Location" above to add one.</p>
                </div>
              )}
            </div>
          </TabsContent>
          
          {/* Factions Tab */}
          <TabsContent value="factions" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Your Factions</h2>
              <Button 
                size="sm" 
                onClick={() => window.location.href = `/worlds/${worldId}/factions/create`}
                className="bg-blue-500 hover:bg-blue-600 text-white"
              >
                <Plus size={16} className="mr-2" /> Create Faction
              </Button>
            </div>
            
            <div className="bg-black/40 border border-gray-800 p-6 rounded-md">
              {entities.factions.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[500px] overflow-y-auto">
                  {entities.factions.map(faction => (
                    <Card key={faction.id} className="bg-black/60 hover:bg-black/80 border border-gray-700 transition-colors">
                      <CardHeader className="p-4 pb-2">
                        <CardTitle className="text-lg">{faction.name}</CardTitle>
                      </CardHeader>
                      <CardContent className="p-4">
                        <p className="text-sm text-gray-400 mb-4">
                          {faction.details.description}
                        </p>
                        <Button variant="ghost" className="w-full justify-between hover:bg-blue-500/20">
                          <span>View Details</span>
                          <ArrowRight size={16} />
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-400">No factions yet. Click "Create Faction" above to add one.</p>
                </div>
              )}
            </div>
          </TabsContent>
          
          {/* Characters Tab */}
          <TabsContent value="characters" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Your Characters</h2>
              <Button 
                size="sm" 
                onClick={() => window.location.href = `/worlds/${worldId}/characters/create`}
                className="bg-blue-500 hover:bg-blue-600 text-white"
              >
                <Plus size={16} className="mr-2" /> Create Character
              </Button>
            </div>
            
            <div className="bg-black/40 border border-gray-800 p-6 rounded-md">
              {entities.characters.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[500px] overflow-y-auto">
                  {entities.characters.map(character => (
                    <Card key={character.id} className="bg-black/60 hover:bg-black/80 border border-gray-700 transition-colors">
                      <CardHeader className="p-4 pb-2">
                        <CardTitle className="text-lg">{character.name}</CardTitle>
                      </CardHeader>
                      <CardContent className="p-4">
                        <div className="flex space-x-4 mb-3">
                          <Badge variant="outline" className="bg-blue-500/20 text-blue-300 border-blue-500/50">
                            {character.details.race}
                          </Badge>
                          <Badge variant="outline" className="bg-blue-500/20 text-blue-300 border-blue-500/50">
                            {character.details.role}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-400 mb-4">
                          {character.details.description}
                        </p>
                        <Button variant="ghost" className="w-full justify-between hover:bg-blue-500/20">
                          <span>View Details</span>
                          <ArrowRight size={16} />
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-400">No characters yet. Click "Create Character" above to add one.</p>
                </div>
              )}
            </div>
          </TabsContent>
          
          {/* Items Tab */}
          <TabsContent value="items" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Your Items</h2>
              <Button 
                size="sm" 
                onClick={() => window.location.href = `/worlds/${worldId}/items/create`}
                className="bg-blue-500 hover:bg-blue-600 text-white"
              >
                <Plus size={16} className="mr-2" /> Create Item
              </Button>
            </div>
            
            <div className="bg-black/40 border border-gray-800 p-6 rounded-md">
              {entities.items.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[500px] overflow-y-auto">
                  {entities.items.map(item => (
                    <Card key={item.id} className="bg-black/60 hover:bg-black/80 border border-gray-700 transition-colors">
                      <CardHeader className="p-4 pb-2">
                        <CardTitle className="text-lg">{item.name}</CardTitle>
                      </CardHeader>
                      <CardContent className="p-4">
                        <div className="mb-3">
                          <Badge variant="outline" className="bg-blue-500/20 text-blue-300 border-blue-500/50">
                            {item.details.type}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-400 mb-4">
                          {item.details.description}
                        </p>
                        <Button variant="ghost" className="w-full justify-between hover:bg-blue-500/20">
                          <span>View Details</span>
                          <ArrowRight size={16} />
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-400">No items yet. Click "Create Item" above to add one.</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Timeline Section - Redesigned for compactness and better style */}
      <div className="mt-8">
        <Card className="bg-black/40 border border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between py-4">
            <CardTitle className="text-xl">Timeline</CardTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowNewEventForm(!showNewEventForm)}
              className="text-gray-400 hover:text-white"
            >
              <PlusCircle size={18} />
            </Button>
          </CardHeader>
          <CardContent className="pt-0">
            {showNewEventForm && (
              <div className="mb-4 p-3 border border-gray-700 bg-black/60 rounded-md space-y-3">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Year</label>
                  <Input
                    value={newYear}
                    onChange={(e) => setNewYear(e.target.value)}
                    placeholder="e.g., 1024"
                    className="bg-black/40 border-gray-700"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Event</label>
                  <Textarea
                    value={newEvent}
                    onChange={(e) => setNewEvent(e.target.value)}
                    placeholder="Describe the event"
                    rows={2}
                    className="bg-black/40 border-gray-700"
                  />
                </div>
                <div className="flex space-x-2">
                  <Button 
                    onClick={handleAddTimelineEvent}
                    size="sm"
                    className="bg-blue-500 hover:bg-blue-600 text-white"
                  >
                    Add Event
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      setShowNewEventForm(false);
                      setNewYear('');
                      setNewEvent('');
                    }}
                    className="border-gray-600 hover:bg-gray-800"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
            
            {editingEvent && (
              <div className="mb-4 p-3 border border-gray-700 bg-black/60 rounded-md space-y-3">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Year</label>
                  <Input
                    value={editingEvent.year}
                    onChange={(e) => setEditingEvent({...editingEvent, year: e.target.value})}
                    placeholder="e.g., 1024"
                    className="bg-black/40 border-gray-700"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Event</label>
                  <Textarea
                    value={editingEvent.description}
                    onChange={(e) => setEditingEvent({...editingEvent, description: e.target.value})}
                    placeholder="Describe the event"
                    rows={2}
                    className="bg-black/40 border-gray-700"
                  />
                </div>
                <div className="flex space-x-2">
                  <Button 
                    onClick={handleEditTimelineEvent}
                    size="sm"
                    className="bg-blue-500 hover:bg-blue-600 text-white"
                  >
                    <Save size={16} className="mr-1" /> Save
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setEditingEvent(null)}
                    className="border-gray-600 hover:bg-gray-800"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
            
            {timeline && timeline.length > 0 ? (
              <ScrollArea className="h-[400px] pr-4">
                <div className="relative border-l border-blue-500/30 ml-3 pl-6">
                  {timeline
                    .sort((a, b) => parseInt(a.year) - parseInt(b.year))
                    .map((event, index) => (
                    <div key={event.id} className="relative mb-3 group">
                      {/* Timeline dot */}
                      <div className="absolute -left-9 top-1 w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center text-xs font-bold">
                        {index + 1}
                      </div>
                      {/* Event marker */}
                      <div className="absolute -left-3 top-1 w-3 h-3 bg-blue-600 rounded-full border-2 border-blue-800"></div>
                      {/* Event content */}
                      <div className="bg-black/30 p-2 rounded-md border border-gray-800 hover:border-blue-500/50 transition-colors">
                        <div className="flex justify-between items-start">
                          <h4 className="font-bold text-sm text-blue-400">{event.year}</h4>
                          <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => setEditingEvent(event)}
                              className="h-6 w-6 p-0 text-blue-400 hover:text-blue-300 hover:bg-blue-500/20"
                            >
                              <Edit size={12} />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleDeleteTimelineEvent(event.id)}
                              className="h-6 w-6 p-0 text-red-400 hover:text-red-300 hover:bg-red-500/20"
                            >
                              <Trash size={12} />
                            </Button>
                          </div>
                        </div>
                        <p className="mt-1 text-sm text-gray-300">{event.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            ) : (
              <p className="text-center py-6 text-gray-400">
                No timeline events yet. Click the + button to add one.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default WorldDetail;