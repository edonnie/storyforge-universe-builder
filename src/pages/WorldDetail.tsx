
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '../components/Layout';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Edit, ArrowRight } from 'lucide-react';

// Mock world data - will be replaced with Supabase data
const worldData = {
  '1': { id: '1', name: 'Eldoria', synopsis: 'A magical realm where ancient powers linger in the shadows.' },
  '2': { id: '2', name: 'Mysthaven', synopsis: 'A coastal city-state known for its arcane universities and merchant fleets.' },
  '3': { id: '3', name: 'Astralheim', synopsis: 'A world where the boundaries between planes are thin and extraplanar beings are common.' },
};

// Mock entity data - will be replaced with Supabase data
const mockEntities = {
  realms: [
    { id: '1', name: 'Northern Kingdom', details: { description: 'A cold, harsh land ruled by warrior kings.' } },
    { id: '2', name: 'Eastern Empire', details: { description: 'A sophisticated realm known for its scholars and mages.' } },
  ],
  locations: [
    { id: '1', name: 'Silverhold', details: { description: 'A mountain fortress city known for its silver mines.' } },
    { id: '2', name: 'Mistwood', details: { description: 'An ancient forest shrouded in perpetual mist.' } },
  ],
  factions: [
    { id: '1', name: 'The Crimson Hand', details: { description: 'A secretive organization of assassins and spies.' } },
    { id: '2', name: 'Order of the Silver Star', details: { description: 'A knightly order dedicated to protecting the realm.' } },
  ],
  characters: [
    { id: '1', name: 'Elyndra Nightshade', details: { 
      race: 'Elf', 
      role: 'Archmage',
      description: 'A powerful elven mage with a mysterious past.'
    }},
    { id: '2', name: 'Thorne Ironheart', details: { 
      race: 'Dwarf', 
      role: 'Master Smith',
      description: 'A gruff dwarf renowned for his masterful weaponsmithing.'
    }},
  ],
  items: [
    { id: '1', name: 'Frostbringer', details: { type: 'Weapon', description: 'A legendary sword that emanates cold.' } },
    { id: '2', name: 'Crystal of Seeing', details: { type: 'Artifact', description: 'A mystical crystal that allows glimpses of distant places.' } },
  ],
};

const WorldDetail = () => {
  const { worldId } = useParams<{ worldId: string }>();
  const [editMode, setEditMode] = useState(false);
  const [synopsis, setSynopsis] = useState(worldData[worldId as keyof typeof worldData]?.synopsis || '');
  
  const world = worldData[worldId as keyof typeof worldData];
  
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
  
  const handleSaveChanges = () => {
    // In the future, this will update the world in Supabase
    setEditMode(false);
  };
  
  return (
    <Layout>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-3xl font-bold">{world.name}</h1>
        <Button onClick={() => window.location.href = '/dashboard'} variant="outline">
          Back to Dashboard
        </Button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - World Synopsis */}
        <div className="lg:col-span-1">
          <Card className="bg-card h-full">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>World Synopsis</CardTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setEditMode(!editMode)}
              >
                <Edit size={18} />
              </Button>
            </CardHeader>
            <CardContent>
              {editMode ? (
                <div className="space-y-4">
                  <Input
                    value={synopsis}
                    onChange={(e) => setSynopsis(e.target.value)}
                    className="w-full h-32 resize-none"
                  />
                  <Button onClick={handleSaveChanges}>Save Changes</Button>
                </div>
              ) : (
                <p>{synopsis}</p>
              )}
            </CardContent>
          </Card>
        </div>
        
        {/* Right Column - Entity Tabs */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="realms">
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
                <Button size="sm">
                  <Plus size={16} className="mr-2" /> Add Realm
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {mockEntities.realms.map(realm => (
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
                ))}
              </div>
            </TabsContent>
            
            {/* Locations Tab */}
            <TabsContent value="locations" className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Locations</h2>
                <Button size="sm">
                  <Plus size={16} className="mr-2" /> Add Location
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {mockEntities.locations.map(location => (
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
                ))}
              </div>
            </TabsContent>
            
            {/* Factions Tab */}
            <TabsContent value="factions" className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Factions</h2>
                <Button size="sm">
                  <Plus size={16} className="mr-2" /> Add Faction
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {mockEntities.factions.map(faction => (
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
                ))}
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
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {mockEntities.characters.map(character => (
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
                ))}
              </div>
            </TabsContent>
            
            {/* Items Tab */}
            <TabsContent value="items" className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Items</h2>
                <Button size="sm">
                  <Plus size={16} className="mr-2" /> Add Item
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {mockEntities.items.map(item => (
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
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default WorldDetail;
