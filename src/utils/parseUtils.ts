
import { Character } from "../components/character/CharacterSheet";

/**
 * Detects if the text is a structured character output
 * @param text The text response from the AI
 * @returns "character" if it's a character sheet, null otherwise
 */
export const detectOutputType = (text: string): "character" | null => {
  // More robust detection that looks for multiple key sections
  const characterSectionKeywords = /(?:NAME|RACE|JOBS|ROLE|CLASS|BIOGRAPHY|BIO|PERSONALITY):/im;
  return characterSectionKeywords.test(text) ? "character" : null;
};

/**
 * Parses structured text output from the AI into character data fields
 * @param text The structured text response from the AI
 * @param character The current character object to update
 * @returns Updated character object
 */
export const parseStructuredOutput = (text: string, character: Character): Character => {
  console.log("Parsing structured output:", text);
  
  // Check if we have a character output
  if (!detectOutputType(text)) {
    console.warn("Input is not a recognized character output, skipping update.");
    return character;
  }

  // Create a deep copy of the current character to update
  const updatedCharacter = JSON.parse(JSON.stringify(character));

  // Helper to extract text content for any labeled section
  const extractSectionContent = (labelText: string): string => {
    // Include all possible section headers to properly detect section boundaries
    const stopLabels = "NAME|RACE|JOBS|ROLE|CLASS|PARENTS|STATS|PERSONALITY|BIOGRAPHY|BIO|ABILITIES|EQUIPMENT & STYLE|EQUIPMENT|NOTES|RELATIONSHIPS|WEAPON|ARMOR|STYLE|MAIN ABILITY|SIGNATURE SKILLS|PASSIVES";
    
    // Create case-insensitive regex to match the section
    const regex = new RegExp(`${labelText}:\\s*([\\s\\S]*?)(?=\\n\\s*(?:${stopLabels}):\\s*|$)`, 'i');
    const match = text.match(regex);
    
    if (match && match[1]) {
      console.log(`Extracted ${labelText}:`, match[1].trim());
      return match[1].trim();
    }
    return "";
  };

  // Helper to extract stat number, defaults to the existing value or empty string
  const extractStat = (statLabel: string): string => {
    // Create a more flexible regex that can handle different formats
    const regex = new RegExp(`${statLabel}(?:\\s*:|:?\\s*)\\s*(\\d+)`, 'i');
    const match = text.match(regex);
    
    if (match && match[1]) {
      console.log(`Extracted ${statLabel}:`, match[1].trim());
      return match[1].trim();
    }
    
    return updatedCharacter.stats[statLabel.toLowerCase()] || "";
  };

  // Parse basic fields with fallbacks to alternative labels
  const name = extractSectionContent("NAME");
  if (name) updatedCharacter.name = name;
  
  const race = extractSectionContent("RACE");
  if (race) updatedCharacter.race = race;
  
  const jobs = extractSectionContent("JOBS") || extractSectionContent("CLASS");
  if (jobs) updatedCharacter.jobs = jobs;
  
  const role = extractSectionContent("ROLE");
  if (role) updatedCharacter.role = role;
  
  const parents = extractSectionContent("PARENTS");
  if (parents) updatedCharacter.parents = parents;
  
  const bio = extractSectionContent("BIO") || extractSectionContent("BIOGRAPHY");
  if (bio) updatedCharacter.bio = bio;
  
  const notes = extractSectionContent("NOTES");
  if (notes) updatedCharacter.notes = notes;
  
  const relationships = extractSectionContent("RELATIONSHIPS");
  if (relationships) updatedCharacter.relationships = relationships;

  // Parse equipment section with multiple approaches
  // First try dedicated sections
  const weaponSection = extractSectionContent("WEAPON");
  const armorSection = extractSectionContent("ARMOR");
  const styleSection = extractSectionContent("STYLE");
  
  if (weaponSection) updatedCharacter.equipment.weapon = weaponSection;
  if (armorSection) updatedCharacter.equipment.armor = armorSection;
  if (styleSection) updatedCharacter.style = styleSection;
  
  // Then try the combined equipment section if needed
  const equipmentSection = extractSectionContent("EQUIPMENT") || extractSectionContent("EQUIPMENT & STYLE");
  if (equipmentSection && (!weaponSection || !armorSection)) {
    console.log("Parsing equipment section:", equipmentSection);
    
    // Look for weapon in the equipment section if not found earlier
    if (!weaponSection) {
      const weaponMatch = equipmentSection.match(/(?:WEAPON|WEAPONS)(?:\s*:|:?\s*)([^,\n]+)/i);
      if (weaponMatch) {
        updatedCharacter.equipment.weapon = weaponMatch[1].trim();
      }
    }
    
    // Look for armor in the equipment section if not found earlier
    if (!armorSection) {
      const armorMatch = equipmentSection.match(/(?:ARMOR|ARMORS|ARMOUR)(?:\s*:|:?\s*)([^,\n]+)/i);
      if (armorMatch) {
        updatedCharacter.equipment.armor = armorMatch[1].trim();
      }
    }
    
    // If we still don't have style, look for it in equipment section
    if (!styleSection) {
      const styleMatch = equipmentSection.match(/(?:STYLE|APPEARANCE)(?:\s*:|:?\s*)([^,\n]+)/i);
      if (styleMatch) {
        updatedCharacter.style = styleMatch[1].trim();
      } else if (equipmentSection.includes("STYLE") || equipmentSection.includes("APPEARANCE")) {
        // If the section mentions style but we couldn't extract it with regex,
        // just use the whole section after removing weapon and armor parts
        let remainingText = equipmentSection
          .replace(/(?:WEAPON|WEAPONS)(?:\s*:|:?\s*)([^,\n]+)/i, '')
          .replace(/(?:ARMOR|ARMORS|ARMOUR)(?:\s*:|:?\s*)([^,\n]+)/i, '')
          .trim();
        
        // Only if we have remaining text and it's not just "STYLE:"
        if (remainingText && !remainingText.match(/^(?:STYLE|APPEARANCE)(?:\s*:|:?\s*)$/i)) {
          updatedCharacter.style = remainingText.replace(/(?:STYLE|APPEARANCE)(?:\s*:|:?\s*)/i, '').trim();
        }
      }
    }
  }

  // Parse stats with fallbacks to alternative names
  const statMapping = {
    "HP": ["HP", "HEALTH", "HIT POINTS"],
    "MP": ["MP", "MANA", "MAGIC POINTS"],
    "physAttack": ["PHYS ATTACK", "PHYSICAL ATTACK", "STR", "STRENGTH"],
    "physDefense": ["PHYS DEFENSE", "PHYSICAL DEFENSE", "CON", "CONSTITUTION"],
    "agility": ["AGILITY", "AGI", "DEX", "DEXTERITY"],
    "magicAttack": ["MAGIC ATTACK", "MAG ATTACK", "INT", "INTELLIGENCE"],
    "magicDefense": ["MAGIC DEFENSE", "MAG DEFENSE", "WIS", "WISDOM"],
    "resist": ["RESIST", "RESISTANCE", "RES"]
  };

  // Extract stats from a dedicated STATS section if available
  const statsSection = extractSectionContent("STATS");
  if (statsSection) {
    console.log("Parsing stats section:", statsSection);
    
    // Try to find each stat within the stats section
    for (const [statKey, statLabels] of Object.entries(statMapping)) {
      for (const label of statLabels) {
        const statMatch = statsSection.match(new RegExp(`${label}(?:\\s*:|:?\\s*)\\s*(\\d+)`, 'i'));
        if (statMatch && statMatch[1]) {
          updatedCharacter.stats[statKey] = statMatch[1].trim();
          break;
        }
      }
    }
  } else {
    // Fallback to searching for stats in the entire text
    for (const [statKey, statLabels] of Object.entries(statMapping)) {
      for (const label of statLabels) {
        const statValue = extractStat(label);
        if (statValue) {
          updatedCharacter.stats[statKey] = statValue;
          break;
        }
      }
    }
  }

  // Parse personality
  const personalityBlock = extractSectionContent("PERSONALITY");
  if (personalityBlock) {
    console.log("Parsing personality block:", personalityBlock);
    
    // Extract MBTI, Enneagram, and Alignment with various formats
    const mbtiMatch = personalityBlock.match(/(?:MBTI|TYPE)(?:\s*:|:?\s*)([A-Z]{2,4})(?=\s|$|,)/i);
    const enneagramMatch = personalityBlock.match(/(?:ENNEAGRAM)(?:\s*:|:?\s*)([\d\w-]+)(?=\s|$|,)/i);
    const alignmentMatch = personalityBlock.match(/(?:ALIGNMENT)(?:\s*:|:?\s*)([A-Za-z ]+?)(?=\s*(?:TRAITS|MBTI|ENNEAGRAM|TYPE):|$|,)/i);
    
    if (mbtiMatch) updatedCharacter.personality.mbti = mbtiMatch[1].trim();
    if (enneagramMatch) updatedCharacter.personality.enneagram = enneagramMatch[1].trim();
    if (alignmentMatch) updatedCharacter.personality.alignment = alignmentMatch[1].trim();
    
    // Extract traits, stopping at the next section header
    const traitsMatch = personalityBlock.match(/TRAITS(?:\s*:|:?\s*)([\s\S]*?)(?=\n[A-Z ]+:|$)/i);
    if (traitsMatch) {
      updatedCharacter.personality.traits = traitsMatch[1].trim();
    } else if (personalityBlock) {
      // If no explicit traits section but we have personality data,
      // extract the remaining text after the defined parts as traits
      let remainingText = personalityBlock
        .replace(/(?:MBTI|TYPE)(?:\s*:|:?\s*)([A-Z]{2,4})(?=\s|$|,)/i, '')
        .replace(/(?:ENNEAGRAM)(?:\s*:|:?\s*)([\d\w-]+)(?=\s|$|,)/i, '')
        .replace(/(?:ALIGNMENT)(?:\s*:|:?\s*)([A-Za-z ]+?)(?=\s*(?:TRAITS|MBTI|ENNEAGRAM|TYPE):|$|,)/i, '')
        .replace(/TRAITS(?:\s*:|:?\s*)/i, '')
        .trim();
      
      if (remainingText) {
        updatedCharacter.personality.traits = remainingText;
      }
    }
  }

  // Parse abilities
  const abilitiesBlock = extractSectionContent("ABILITIES");
  if (abilitiesBlock) {
    console.log("Parsing abilities block:", abilitiesBlock);
    
    // Try various label patterns for main ability
    const mainAbilityMatch = abilitiesBlock.match(/(?:MAIN[\s_-]*ABILITY|SPECIAL[\s_-]*ABILITY|UNIQUE[\s_-]*ABILITY)(?:\s*:|:?\s*)([^,\n]+)/i);
    if (mainAbilityMatch) updatedCharacter.abilities.mainAbility = mainAbilityMatch[1].trim();
    
    // Try various label patterns for signature skills
    const skillsMatch = abilitiesBlock.match(/(?:SIGNATURE[\s_-]*SKILLS|SKILLS|ACTIVE[\s_-]*SKILLS)(?:\s*:|:?\s*)([\s\S]*?)(?=\s*(?:PASSIVE|UNIQUE|MAIN|$))/i);
    if (skillsMatch) updatedCharacter.abilities.signatureSkills = skillsMatch[1].trim();
    
    // Try various label patterns for passives
    const passivesMatch = abilitiesBlock.match(/(?:PASSIVE[\s_-]*(?:ABILITIES|SKILLS)|PASSIVES)(?:\s*:|:?\s*)([\s\S]*?)$/i);
    if (passivesMatch) updatedCharacter.abilities.passives = passivesMatch[1].trim();
  } else {
    // Try direct section extraction if abilities block not found
    const mainAbility = extractSectionContent("MAIN ABILITY") || extractSectionContent("SPECIAL ABILITY");
    const signatureSkills = extractSectionContent("SIGNATURE SKILLS") || extractSectionContent("SKILLS");
    const passives = extractSectionContent("PASSIVES") || extractSectionContent("PASSIVE ABILITIES");
    
    if (mainAbility) updatedCharacter.abilities.mainAbility = mainAbility;
    if (signatureSkills) updatedCharacter.abilities.signatureSkills = signatureSkills;
    if (passives) updatedCharacter.abilities.passives = passives;
  }

  console.log("Updated character:", updatedCharacter);
  return updatedCharacter;
};
