
// Utility functions for world management
export interface World {
  id: string;
  name: string;
  createdAt: string;
  synopsis?: string;
}

export interface Entity {
  id: string;
  worldId: string;
  name: string;
  type: 'realm' | 'location' | 'faction' | 'character' | 'item';
  details: Record<string, any>;
  createdAt: string;
}

// These functions will be replaced with Supabase calls in the future
export const fetchWorlds = async (userId: string): Promise<World[]> => {
  // Mock data for now
  const worlds = [
    { id: '1', name: 'Eldoria', createdAt: '2023-05-15T12:00:00Z', synopsis: 'A magical realm where ancient powers linger in the shadows.' },
    { id: '2', name: 'Mysthaven', createdAt: '2023-06-22T09:30:00Z', synopsis: 'A coastal city-state known for its arcane universities and merchant fleets.' },
    { id: '3', name: 'Astralheim', createdAt: '2023-07-10T15:45:00Z', synopsis: 'A world where the boundaries between planes are thin and extraplanar beings are common.' },
  ];
  
  return new Promise(resolve => {
    setTimeout(() => resolve(worlds), 500);
  });
};

export const fetchWorldById = async (worldId: string): Promise<World | null> => {
  const worlds = {
    '1': { id: '1', name: 'Eldoria', createdAt: '2023-05-15T12:00:00Z', synopsis: 'A magical realm where ancient powers linger in the shadows.' },
    '2': { id: '2', name: 'Mysthaven', createdAt: '2023-06-22T09:30:00Z', synopsis: 'A coastal city-state known for its arcane universities and merchant fleets.' },
    '3': { id: '3', name: 'Astralheim', createdAt: '2023-07-10T15:45:00Z', synopsis: 'A world where the boundaries between planes are thin and extraplanar beings are common.' },
  };
  
  return new Promise(resolve => {
    setTimeout(() => resolve(worlds[worldId as keyof typeof worlds] || null), 300);
  });
};

export const fetchEntitiesByWorldId = async (worldId: string, type?: string): Promise<Entity[]> => {
  // Mock entities data - will be replaced with Supabase data
  const allEntities = [
    // Realms
    { id: '1', worldId: '1', name: 'Northern Kingdom', type: 'realm', details: { description: 'A cold, harsh land ruled by warrior kings.' }, createdAt: '2023-05-20T10:30:00Z' },
    { id: '2', worldId: '1', name: 'Eastern Empire', type: 'realm', details: { description: 'A sophisticated realm known for its scholars and mages.' }, createdAt: '2023-05-22T14:15:00Z' },
    
    // Locations
    { id: '3', worldId: '1', name: 'Silverhold', type: 'location', details: { description: 'A mountain fortress city known for its silver mines.' }, createdAt: '2023-05-25T09:20:00Z' },
    { id: '4', worldId: '1', name: 'Mistwood', type: 'location', details: { description: 'An ancient forest shrouded in perpetual mist.' }, createdAt: '2023-05-26T11:45:00Z' },
    
    // Factions
    { id: '5', worldId: '1', name: 'The Crimson Hand', type: 'faction', details: { description: 'A secretive organization of assassins and spies.' }, createdAt: '2023-05-30T16:10:00Z' },
    { id: '6', worldId: '1', name: 'Order of the Silver Star', type: 'faction', details: { description: 'A knightly order dedicated to protecting the realm.' }, createdAt: '2023-06-02T13:25:00Z' },
    
    // Characters
    { id: '7', worldId: '1', name: 'Elyndra Nightshade', type: 'character', details: { 
      race: 'Elf', 
      role: 'Archmage',
      description: 'A powerful elven mage with a mysterious past.'
    }, createdAt: '2023-06-05T10:00:00Z' },
    { id: '8', worldId: '1', name: 'Thorne Ironheart', type: 'character', details: { 
      race: 'Dwarf', 
      role: 'Master Smith',
      description: 'A gruff dwarf renowned for his masterful weaponsmithing.'
    }, createdAt: '2023-06-08T14:30:00Z' },
    
    // Items
    { id: '9', worldId: '1', name: 'Frostbringer', type: 'item', details: { type: 'Weapon', description: 'A legendary sword that emanates cold.' }, createdAt: '2023-06-10T09:15:00Z' },
    { id: '10', worldId: '1', name: 'Crystal of Seeing', type: 'item', details: { type: 'Artifact', description: 'A mystical crystal that allows glimpses of distant places.' }, createdAt: '2023-06-12T11:20:00Z' },
  ];
  
  const filtered = type 
    ? allEntities.filter(entity => entity.worldId === worldId && entity.type === type)
    : allEntities.filter(entity => entity.worldId === worldId);
  
  return new Promise(resolve => {
    setTimeout(() => resolve(filtered), 300);
  });
};

export const createWorld = async (userId: string, name: string): Promise<World> => {
  const newWorld = {
    id: Math.random().toString(36).substr(2, 9),
    name,
    createdAt: new Date().toISOString(),
  };
  
  return new Promise(resolve => {
    setTimeout(() => resolve(newWorld), 500);
  });
};

export const createEntity = async (worldId: string, name: string, type: string, details: any): Promise<Entity> => {
  const newEntity = {
    id: Math.random().toString(36).substr(2, 9),
    worldId,
    name,
    type: type as 'realm' | 'location' | 'faction' | 'character' | 'item',
    details,
    createdAt: new Date().toISOString(),
  };
  
  return new Promise(resolve => {
    setTimeout(() => resolve(newEntity), 500);
  });
};

export const updateWorld = async (worldId: string, updates: Partial<World>): Promise<World> => {
  // This would be a Supabase update call in the real implementation
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        id: worldId,
        name: updates.name || 'Unknown World',
        createdAt: new Date().toISOString(),
        synopsis: updates.synopsis,
      });
    }, 300);
  });
};
