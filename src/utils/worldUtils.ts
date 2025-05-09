
// Utility functions for world management
export interface World {
  id: string;
  name: string;
  createdAt: string;
  synopsis?: string;
  timeline?: TimelineEvent[];
}

export type EntityType = 'realm' | 'location' | 'faction' | 'character' | 'item';

export interface Entity {
  id: string;
  worldId: string;
  name: string;
  type: EntityType;
  details: Record<string, any>;
  createdAt: string;
}

export interface TimelineEvent {
  id: string;
  year: string;
  description: string;
  createdAt: string;
}

// Helper function to get worlds from localStorage
const getLocalWorlds = (): World[] => {
  try {
    const localWorlds = localStorage.getItem('fateWorlds');
    if (!localWorlds) return [];
    
    // Parse worlds and remove any duplicates by ID
    const worlds = JSON.parse(localWorlds) as World[];
    const uniqueWorlds = worlds.reduce((acc, current) => {
      const x = acc.find(item => item.id === current.id);
      if (!x) {
        return [...acc, current];
      } else {
        return acc;
      }
    }, [] as World[]);
    
    return uniqueWorlds;
  } catch (error) {
    console.error('Error retrieving worlds from localStorage:', error);
    return [];
  }
};

// Helper function to save worlds to localStorage
const saveLocalWorlds = (worlds: World[]): void => {
  try {
    // Ensure we don't have duplicate IDs before saving
    const uniqueWorlds = worlds.reduce((acc, current) => {
      const x = acc.find(item => item.id === current.id);
      if (!x) {
        return [...acc, current];
      } else {
        return acc;
      }
    }, [] as World[]);
    
    localStorage.setItem('fateWorlds', JSON.stringify(uniqueWorlds));
  } catch (error) {
    console.error('Error saving worlds to localStorage:', error);
  }
};

// These functions will be replaced with Supabase calls in the future
export const fetchWorlds = async (userId: string): Promise<World[]> => {
  // Check localStorage first
  const localWorlds = getLocalWorlds();
  if (localWorlds.length > 0) {
    console.log('Retrieved worlds from localStorage:', localWorlds);
    return localWorlds;
  }
  
  // Mock data as fallback
  const mockWorlds = [
    { 
      id: '1', 
      name: 'Eldoria', 
      createdAt: '2023-05-15T12:00:00Z', 
      synopsis: 'A magical realm where ancient powers linger in the shadows.',
      timeline: [
        { id: '1', year: '1024', description: 'The Great War between the Northern Kingdom and Eastern Empire begins', createdAt: '2023-05-16T10:00:00Z' },
        { id: '2', year: '1030', description: 'The Order of the Silver Star is formed to restore peace', createdAt: '2023-05-16T11:00:00Z' },
        { id: '3', year: '1035', description: 'The Crimson Hand assassinates the Emperor of the East', createdAt: '2023-05-16T12:00:00Z' },
      ]
    },
    { id: '2', name: 'Mysthaven', createdAt: '2023-06-22T09:30:00Z', synopsis: 'A coastal city-state known for its arcane universities and merchant fleets.' },
    { id: '3', name: 'Astralheim', createdAt: '2023-07-10T15:45:00Z', synopsis: 'A world where the boundaries between planes are thin and extraplanar beings are common.' },
  ];
  
  // Store mock data in localStorage if nothing exists yet
  if (localWorlds.length === 0) {
    saveLocalWorlds(mockWorlds);
  }
  
  return mockWorlds;
};

export const fetchWorldById = async (worldId: string): Promise<World | null> => {
  // First check localStorage for user-created worlds
  const localWorlds = getLocalWorlds();
  const localWorld = localWorlds.find(world => world.id === worldId);
  
  if (localWorld) {
    console.log('Found world in localStorage:', localWorld);
    return localWorld;
  }
  
  // Check for the most recently created world
  const lastCreatedWorldId = localStorage.getItem('lastCreatedWorldId');
  if (lastCreatedWorldId === worldId) {
    const lastCreatedWorld = localStorage.getItem('lastCreatedWorld');
    if (lastCreatedWorld) {
      const parsedWorld = JSON.parse(lastCreatedWorld);
      console.log('Using last created world:', parsedWorld);
      return parsedWorld;
    }
  }
  
  // Fallback to mock data if not found
  const mockWorlds = {
    '1': { 
      id: '1', 
      name: 'Eldoria', 
      createdAt: '2023-05-15T12:00:00Z', 
      synopsis: 'A magical realm where ancient powers linger in the shadows.',
      timeline: [
        { id: '1', year: '1024', description: 'The Great War between the Northern Kingdom and Eastern Empire begins', createdAt: '2023-05-16T10:00:00Z' },
        { id: '2', year: '1030', description: 'The Order of the Silver Star is formed to restore peace', createdAt: '2023-05-16T11:00:00Z' },
        { id: '3', year: '1035', description: 'The Crimson Hand assassinates the Emperor of the East', createdAt: '2023-05-16T12:00:00Z' },
      ]
    },
    '2': { id: '2', name: 'Mysthaven', createdAt: '2023-06-22T09:30:00Z', synopsis: 'A coastal city-state known for its arcane universities and merchant fleets.' },
    '3': { id: '3', name: 'Astralheim', createdAt: '2023-07-10T15:45:00Z', synopsis: 'A world where the boundaries between planes are thin and extraplanar beings are common.' },
  };
  
  console.log('World not found in localStorage, checking mock data for ID:', worldId);
  return mockWorlds[worldId as keyof typeof mockWorlds] || null;
};

export const fetchEntitiesByWorldId = async (worldId: string, type?: EntityType): Promise<Entity[]> => {
  // Mock entities data - will be replaced with Supabase data
  const allEntities: Entity[] = [
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
  // Generate a truly unique ID with timestamp component
  const timestamp = new Date().getTime();
  const randomStr = Math.random().toString(36).substring(2, 8);
  const newId = `world_${timestamp}_${randomStr}`;
  
  const newWorld = {
    id: newId,
    name,
    createdAt: new Date().toISOString(),
    synopsis: '',
    timeline: []
  };
  
  // Store the newly created world in localStorage for future reference
  localStorage.setItem('lastCreatedWorld', JSON.stringify(newWorld));
  localStorage.setItem('lastCreatedWorldId', newWorld.id);
  
  // Also add to the list of worlds in localStorage
  const existingWorlds = getLocalWorlds();
  existingWorlds.push(newWorld);
  saveLocalWorlds(existingWorlds);
  
  console.log('Created new world:', newWorld);
  return newWorld;
};

export const createEntity = async (worldId: string, name: string, type: EntityType, details: any): Promise<Entity> => {
  const newEntity = {
    id: Math.random().toString(36).substr(2, 9),
    worldId,
    name,
    type,
    details,
    createdAt: new Date().toISOString(),
  };
  
  return new Promise(resolve => {
    setTimeout(() => resolve(newEntity), 500);
  });
};

export const updateWorld = async (worldId: string, updates: Partial<World>): Promise<World> => {
  // First check if we have this world in localStorage
  const localWorlds = getLocalWorlds();
  const worldIndex = localWorlds.findIndex(world => world.id === worldId);
  
  if (worldIndex !== -1) {
    // Update the world in localStorage
    const updatedWorld = {
      ...localWorlds[worldIndex],
      ...updates,
    };
    localWorlds[worldIndex] = updatedWorld;
    saveLocalWorlds(localWorlds);
    console.log('Updated world in localStorage:', updatedWorld);
    return updatedWorld;
  }
  
  // This would be a Supabase update call in the real implementation
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        id: worldId,
        name: updates.name || 'Unknown World',
        createdAt: new Date().toISOString(),
        synopsis: updates.synopsis,
        timeline: updates.timeline,
      });
    }, 300);
  });
};

export const updateEntity = async (entityId: string, worldId: string, updates: Partial<Entity>): Promise<Entity> => {
  // This would be a Supabase update call in the real implementation
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        id: entityId,
        worldId,
        name: updates.name || 'Unknown Entity',
        type: updates.type || 'character',
        details: updates.details || {},
        createdAt: new Date().toISOString(),
      });
    }, 300);
  });
};

export const addTimelineEvent = async (worldId: string, year: string, description: string): Promise<TimelineEvent> => {
  const newEvent = {
    id: Math.random().toString(36).substr(2, 9),
    year,
    description,
    createdAt: new Date().toISOString(),
  };
  
  // This would update the timeline array in the Supabase world record
  return new Promise(resolve => {
    setTimeout(() => resolve(newEvent), 300);
  });
};
