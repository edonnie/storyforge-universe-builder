
import { Character } from "../components/character/CharacterSheet";

/**
 * Parses structured text output from the AI into character data fields
 * @param text The structured text response from the AI
 * @param character The current character object to update
 * @returns Updated character object
 */
export const parseStructuredOutput = (text: string, character: Character): Character => {
  // Create a deep copy of the current character to update
  const updatedCharacter = JSON.parse(JSON.stringify(character));

  // Split by main sections
  const sections: Record<string, string> = {};
  
  // Define the section headers we're looking for
  const sectionHeaders = [
    "NAME:", "RACE:", "JOBS:", "ROLE:", "PARENTS:", 
    "PERSONALITY:", "BIO:", "BIOGRAPHY:", "EQUIPMENT:", 
    "STYLE:", "STATS:", "ABILITIES:", "NOTES:", "RELATIONSHIPS:"
  ];

  // Find the start index of each section
  const sectionIndices: Record<string, number> = {};
  sectionHeaders.forEach(header => {
    const index = text.indexOf(header);
    if (index !== -1) {
      sectionIndices[header] = index;
    }
  });

  // Sort the section headers by their position in the text
  const sortedHeaders = Object.keys(sectionIndices).sort((a, b) => sectionIndices[a] - sectionIndices[b]);

  // Extract the content for each section
  sortedHeaders.forEach((header, index) => {
    const startIndex = sectionIndices[header] + header.length;
    const endIndex = index < sortedHeaders.length - 1 ? sectionIndices[sortedHeaders[index + 1]] : text.length;
    sections[header] = text.substring(startIndex, endIndex).trim();
  });

  // Update character fields based on the parsed sections
  if (sections["NAME:"]) {
    updatedCharacter.name = sections["NAME:"];
  }
  
  if (sections["RACE:"]) {
    updatedCharacter.race = sections["RACE:"];
  }
  
  if (sections["JOBS:"]) {
    updatedCharacter.jobs = sections["JOBS:"];
  }
  
  if (sections["ROLE:"]) {
    updatedCharacter.role = sections["ROLE:"];
  }
  
  if (sections["PARENTS:"]) {
    updatedCharacter.parents = sections["PARENTS:"];
  }

  if (sections["STATS:"]) {
    const statsText = sections["STATS:"];
    // Extract stats using regex pattern
    const hpMatch = statsText.match(/HP:?\s*(\d+)/i);
    const mpMatch = statsText.match(/MP:?\s*(\d+)/i);
    const physAttackMatch = statsText.match(/(?:PHYS(?:ICAL)?[\s_-]*ATTACK|STR(?:ENGTH)?):?\s*(\d+)/i);
    const physDefenseMatch = statsText.match(/(?:PHYS(?:ICAL)?[\s_-]*DEF(?:ENSE)?|CON(?:STITUTION)?):?\s*(\d+)/i);
    const agilityMatch = statsText.match(/(?:AGI(?:LITY)?|DEX(?:TERITY)?):?\s*(\d+)/i);
    const magicAttackMatch = statsText.match(/(?:MAG(?:IC)?[\s_-]*ATTACK|INT(?:ELLIGENCE)?):?\s*(\d+)/i);
    const magicDefenseMatch = statsText.match(/(?:MAG(?:IC)?[\s_-]*DEF(?:ENSE)?|WIS(?:DOM)?):?\s*(\d+)/i);
    const resistMatch = statsText.match(/(?:RES(?:IST)?|RESISTANCE):?\s*(\d+)/i);
    
    if (hpMatch) updatedCharacter.stats.hp = hpMatch[1];
    if (mpMatch) updatedCharacter.stats.mp = mpMatch[1];
    if (physAttackMatch) updatedCharacter.stats.physAttack = physAttackMatch[1];
    if (physDefenseMatch) updatedCharacter.stats.physDefense = physDefenseMatch[1];
    if (agilityMatch) updatedCharacter.stats.agility = agilityMatch[1];
    if (magicAttackMatch) updatedCharacter.stats.magicAttack = magicAttackMatch[1];
    if (magicDefenseMatch) updatedCharacter.stats.magicDefense = magicDefenseMatch[1];
    if (resistMatch) updatedCharacter.stats.resist = resistMatch[1];
  }

  if (sections["PERSONALITY:"]) {
    const personalityText = sections["PERSONALITY:"];
    
    // Extract personality traits
    const mbtiMatch = personalityText.match(/MBTI:?\s*([A-Z]{4})/i);
    const enneagramMatch = personalityText.match(/ENNEAGRAM:?\s*([\dw]+)/i);
    const alignmentMatch = personalityText.match(/ALIGNMENT:?\s*([^,\n]+)/i);
    
    if (mbtiMatch) updatedCharacter.personality.mbti = mbtiMatch[1];
    if (enneagramMatch) updatedCharacter.personality.enneagram = enneagramMatch[1];
    if (alignmentMatch) updatedCharacter.personality.alignment = alignmentMatch[1];
    
    // For traits, try to extract everything after "TRAITS:" if it exists
    // But stop at the next section header if present
    const traitsRegex = /TRAITS:?\s*([\s\S]*?)(?=\s*(?:BIO(?:GRAPHY)?:|EQUIPMENT:|STYLE:|STATS:|ABILITIES:|NOTES:|RELATIONSHIPS:)|$)/i;
    const traitsMatch = personalityText.match(traitsRegex);
    
    if (traitsMatch) {
      updatedCharacter.personality.traits = traitsMatch[1].trim();
    }
  }

  // Handle both BIO and BIOGRAPHY
  if (sections["BIOGRAPHY:"] || sections["BIO:"]) {
    updatedCharacter.bio = (sections["BIOGRAPHY:"] || sections["BIO:"]).trim();
  }

  if (sections["ABILITIES:"]) {
    const abilitiesText = sections["ABILITIES:"];
    
    // Extract main ability
    const mainAbilityMatch = abilitiesText.match(/(?:MAIN[\s_-]*ABILITY|SPECIAL[\s_-]*ABILITY):?\s*([^,\n]+)/i);
    if (mainAbilityMatch) updatedCharacter.abilities.mainAbility = mainAbilityMatch[1].trim();
    
    // Extract signature skills
    const skillsMatch = abilitiesText.match(/(?:SIGNATURE[\s_-]*SKILLS|SKILLS):?\s*([\s\S]*?)(?=\s*(?:PASSIVE|$))/i);
    if (skillsMatch) updatedCharacter.abilities.signatureSkills = skillsMatch[1].trim();
    
    // Extract passives
    const passivesMatch = abilitiesText.match(/(?:PASSIVE[\s_-]*(?:ABILITIES|SKILLS)|PASSIVES):?\s*([\s\S]*?)$/i);
    if (passivesMatch) updatedCharacter.abilities.passives = passivesMatch[1].trim();
  }

  if (sections["EQUIPMENT:"]) {
    const equipmentText = sections["EQUIPMENT:"];
    
    // Extract weapon and armor
    const weaponMatch = equipmentText.match(/(?:WEAPON|WEAPONS):?\s*([^,\n]+)/i);
    const armorMatch = equipmentText.match(/(?:ARMOR|ARMORS|ARMOUR):?\s*([^,\n]+)/i);
    
    if (weaponMatch) updatedCharacter.equipment.weapon = weaponMatch[1].trim();
    if (armorMatch) updatedCharacter.equipment.armor = armorMatch[1].trim();
  }

  if (sections["STYLE:"]) {
    updatedCharacter.style = sections["STYLE:"].trim();
  }

  if (sections["NOTES:"]) {
    updatedCharacter.notes = sections["NOTES:"].trim();
  }

  if (sections["RELATIONSHIPS:"]) {
    updatedCharacter.relationships = sections["RELATIONSHIPS:"].trim();
  }

  return updatedCharacter;
};
