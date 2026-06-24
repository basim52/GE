import { useState, useEffect, useCallback, useRef } from 'react';
import { 
  ArrowLeft, ArrowRight, Sword, Shield as ShieldIcon, Heart, 
  Sparkles, RefreshCw, Trophy, Zap, Award, Smile, Volume2, VolumeX,
  Flame, Dices, Gift, Info
} from 'lucide-react';

const IMAGES = [
  { 
    name: 'Pyrogon',
    element: 'Fire',
    desc: 'The hot-headed solar champion. Masters high-risk, explosive fire magic.',
    src: 'https://fifth-gentle-45902158.figma.site/_components/v2/4de492f6d9cf8244ad5293233e5c6f52407d42fc/1.02464a56.png', 
    bg: '#F4845F', 
    panel: '#F79B7F',
    hp: 120,
    atk: 24,
    def: 10,
    color: 'text-orange-500',
    borderColor: 'border-orange-500',
    bgColor: 'bg-orange-500',
    cards: [
      { id: 'f1', name: 'Solar Flare', type: 'attack', value: 25, cost: 1, desc: 'Blasts the enemy with direct sun rays. Deals 25 DMG.', icon: Sword },
      { id: 'f2', name: 'Magma Shield', type: 'defend', value: 15, cost: 1, desc: 'Creates a barrier. Grants 15 Block & heals 6 HP.', icon: ShieldIcon },
      { id: 'f3', name: 'Supernova', type: 'ultimate', value: 42, cost: 2, desc: 'Unleashes massive solar force. Deals 42 DMG but self-inflicts 8 recoil.', icon: Sparkles }
    ]
  },
  { 
    name: 'Leafox',
    element: 'Earth',
    desc: 'The ancient guardian of the deep woods. Specializes in defense and regeneration.',
    src: 'https://fifth-gentle-45902158.figma.site/_components/v2/4de492f6d9cf8244ad5293233e5c6f52407d42fc/2.b977faab.png', 
    bg: '#6BBF7A', 
    panel: '#85CC92',
    hp: 150,
    atk: 18,
    def: 16,
    color: 'text-emerald-500',
    borderColor: 'border-emerald-500',
    bgColor: 'bg-emerald-500',
    cards: [
      { id: 'e1', name: 'Leaf Blade', type: 'attack', value: 20, cost: 1, desc: 'Swipes with sharp, durable foliage. Deals 20 DMG.', icon: Sword },
      { id: 'e2', name: 'Iron Bark', type: 'defend', value: 24, cost: 1, desc: 'Fortifies body with ancient roots. Grants 24 Block.', icon: ShieldIcon },
      { id: 'e3', name: 'Root Regrowth', type: 'ultimate', value: 30, cost: 2, desc: 'Absorbs soil vitality. Heals 30 HP & grants 10 Block.', icon: Heart }
    ]
  },
  { 
    name: 'Pixilina',
    element: 'Magic',
    desc: 'The charming dimensional fairy. Loves stealing energy and magic tricks.',
    src: 'https://fifth-gentle-45902158.figma.site/_components/v2/4de492f6d9cf8244ad5293233e5c6f52407d42fc/3.4df853b4.png', 
    bg: '#E882B4', 
    panel: '#ED9DC4',
    hp: 110,
    atk: 26,
    def: 8,
    color: 'text-pink-500',
    borderColor: 'border-pink-500',
    bgColor: 'bg-pink-500',
    cards: [
      { id: 'm1', name: 'Pixie Dust', type: 'attack', value: 22, cost: 1, desc: 'Throws high-energy stardust. Deals 22 DMG.', icon: Sword },
      { id: 'm2', name: 'Heart Barrier', type: 'defend', value: 12, cost: 1, desc: 'Erects a cute shield. Grants 12 Block & siphons 8 HP from target.', icon: ShieldIcon },
      { id: 'm3', name: 'Cosmic Burst', type: 'ultimate', value: 45, cost: 2, desc: 'Collapses a tiny galaxy. Deals 45 DMG of raw magic.', icon: Sparkles }
    ]
  },
  { 
    name: 'Frosty',
    element: 'Ice',
    desc: 'The cool-headed glacier wanderer. Slows enemies and has frozen defense.',
    src: 'https://fifth-gentle-45902158.figma.site/_components/v2/4de492f6d9cf8244ad5293233e5c6f52407d42fc/4.4457fbce.png', 
    bg: '#6EB5FF', 
    panel: '#8DC4FF',
    hp: 130,
    atk: 20,
    def: 12,
    color: 'text-blue-500',
    borderColor: 'border-blue-500',
    bgColor: 'bg-blue-500',
    cards: [
      { id: 'i1', name: 'Ice Lance', type: 'attack', value: 21, cost: 1, desc: 'Launches a sharp frozen spear. Deals 21 DMG.', icon: Sword },
      { id: 'i2', name: 'Glacier Wall', type: 'defend', value: 20, cost: 1, desc: 'Summons a barrier of pure frost. Grants 20 Block.', icon: ShieldIcon },
      { id: 'i3', name: 'Blizzard Freeze', type: 'ultimate', value: 35, cost: 2, desc: 'Freezes the arena. Deals 35 DMG and weakens enemy ATK by 5 next turn.', icon: Zap }
    ]
  },
];

const CHAOS_MUTATORS = [
  { name: '🔥 Supernova Mode', desc: 'All attacks deal +12 extra Raw Damage!' },
  { name: '💎 Overflow Mana', desc: 'Turn starting energy/mana is capped at 4 instead of 3.' },
  { name: '🛡️ Fortified Walls', desc: 'All shielding actions grant +10 extra Block.' },
  { name: '❤️ Vampiric Siphon', desc: 'Every card played siphons and heals your character for 5 HP.' },
  { name: '⚡ High Voltage', desc: 'Ultimates deal 1.5x damage but self-recoil 5 HP.' },
  { name: '🌪️ Normal Gravity', desc: 'Classic standard tournament rules apply.' },
];

const LUCKY_ITEMS = [
  { name: '🌶️ Spicy Chili', type: 'atk', desc: '+6 DMG on all attacks for this round!', icon: Flame, color: 'text-red-400' },
  { name: '💊 Health Elixir', type: 'hp', desc: '+30 Max HP starting boost!', icon: Heart, color: 'text-emerald-400' },
  { name: '🛡️ Aegis Shield', type: 'block', desc: 'Start the battle with +20 Block shield!', icon: ShieldIcon, color: 'text-cyan-400' },
  { name: '❌ Empty Capsule', type: 'none', desc: 'Keep it natural this turn.', icon: Dices, color: 'text-slate-400' }
];

const TAUNT_PHRASES = [
  "Is that all you've got?",
  "You're about to get melted!",
  "My legendary figurine can't be beaten!",
  "Time to show you real strategy!",
  "Too slow! Try harder next time.",
  "Checkmate! Prepare to face my ultimate."
];

export default function App() {
  // Navigation & Screen View State
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [viewState, setViewState] = useState<'select' | 'battle' | 'victory' | 'defeat'>('select');

  // Audio configuration state
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Player & Opponent Live Game State
  const [playerHp, setPlayerHp] = useState(100);
  const [maxPlayerHp, setMaxPlayerHp] = useState(100);
  const [playerShield, setPlayerShield] = useState(0);
  const [playerEnergy, setPlayerEnergy] = useState(3);
  const [maxPlayerEnergy, setMaxPlayerEnergy] = useState(3);
  
  const [opponentIndex, setOpponentIndex] = useState(1);
  const [opponentHp, setOpponentHp] = useState(100);
  const [maxOpponentHp, setMaxOpponentHp] = useState(100);
  const [opponentShield, setOpponentShield] = useState(0);
  
  const [turn, setTurn] = useState<'player' | 'opponent'>('player');
  const [battleLogs, setBattleLogs] = useState<string[]>([]);
  
  // Animation states for battle moves
  const [playerAnim, setPlayerAnim] = useState<'idle' | 'attack' | 'hit' | 'heal' | 'shield'>('idle');
  const [opponentAnim, setOpponentAnim] = useState<'idle' | 'attack' | 'hit' | 'heal' | 'shield'>('idle');
  const [floatingText, setFloatingText] = useState<{ id: number; text: string; color: string; target: 'player' | 'opponent' }[]>([]);
  const floatingIdCounter = useRef(0);

  // Stats & Upgrades (Saved locally)
  const [wins, setWins] = useState(0);
  const [losses, setLosses] = useState(0);
  const [level, setLevel] = useState(1);
  const [upgradePoints, setUpgradePoints] = useState(0);
  const [bonusAtk, setBonusAtk] = useState(0);
  const [bonusDef, setBonusDef] = useState(0);
  const [bonusHp, setBonusHp] = useState(0);

  // New fun features state
  const [selectedMutator, setSelectedMutator] = useState<typeof CHAOS_MUTATORS[0] | null>(null);
  const [spinningMutator, setSpinningMutator] = useState(false);
  const [capsuleItem, setCapsuleItem] = useState<typeof LUCKY_ITEMS[0] | null>(null);
  const [spinningCapsule, setSpinningCapsule] = useState(false);
  const [playerTaunt, setPlayerTaunt] = useState<string | null>(null);
  const [oppTaunt, setOppTaunt] = useState<string | null>(null);

  // Web Audio Procedural Synth Sound Generator
  const playSound = useCallback((type: 'click' | 'attack' | 'block' | 'heal' | 'win' | 'lose' | 'spin') => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      osc.connect(gainNode);
      gainNode.connect(ctx.destination);

      const now = ctx.currentTime;

      if (type === 'click') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.exponentialRampToValueAtTime(110, now + 0.1);
        gainNode.gain.setValueAtTime(0.15, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
        osc.start(now);
        osc.stop(now + 0.1);
      } else if (type === 'spin') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(587.33, now); // D5
        osc.frequency.setValueAtTime(659.25, now + 0.05); // E5
        gainNode.gain.setValueAtTime(0.08, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.12);
        osc.start(now);
        osc.stop(now + 0.12);
      } else if (type === 'attack') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.3);
        gainNode.gain.setValueAtTime(0.12, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
        osc.start(now);
        osc.stop(now + 0.3);
      } else if (type === 'block') {
        osc.type = 'square';
        osc.frequency.setValueAtTime(150, now);
        osc.frequency.setValueAtTime(220, now + 0.08);
        gainNode.gain.setValueAtTime(0.14, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
        osc.start(now);
        osc.stop(now + 0.25);
      } else if (type === 'heal') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, now); // C5
        osc.frequency.setValueAtTime(659.25, now + 0.1); // E5
        osc.frequency.setValueAtTime(783.99, now + 0.2); // G5
        osc.frequency.setValueAtTime(1046.50, now + 0.3); // C6
        gainNode.gain.setValueAtTime(0.15, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.45);
        osc.start(now);
        osc.stop(now + 0.45);
      } else if (type === 'win') {
        // Glorious fanfare
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, now); // C5
        osc.frequency.setValueAtTime(659.25, now + 0.15); // E5
        osc.frequency.setValueAtTime(783.99, now + 0.3); // G5
        osc.frequency.setValueAtTime(1046.50, now + 0.45); // C6
        gainNode.gain.setValueAtTime(0.18, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.8);
        osc.start(now);
        osc.stop(now + 0.8);
      } else if (type === 'lose') {
        // Low sad slide
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.linearRampToValueAtTime(80, now + 0.7);
        gainNode.gain.setValueAtTime(0.2, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.7);
        osc.start(now);
        osc.stop(now + 0.7);
      }
    } catch (e) {
      console.warn("Audio Context not supported yet on user browser", e);
    }
  }, [soundEnabled]);

  // Preload all 4 images on mount
  useEffect(() => {
    IMAGES.forEach((img) => {
      const image = new Image();
      image.src = img.src;
    });

    // Load saved progression
    const savedWins = localStorage.getItem('toon_wins');
    const savedLosses = localStorage.getItem('toon_losses');
    const savedLevel = localStorage.getItem('toon_level');
    const savedPoints = localStorage.getItem('toon_points');
    const savedAtk = localStorage.getItem('toon_bonus_atk');
    const savedDef = localStorage.getItem('toon_bonus_def');
    const savedHp = localStorage.getItem('toon_bonus_hp');

    if (savedWins) setWins(parseInt(savedWins));
    if (savedLosses) setLosses(parseInt(savedLosses));
    if (savedLevel) setLevel(parseInt(savedLevel));
    if (savedPoints) setUpgradePoints(parseInt(savedPoints));
    if (savedAtk) setBonusAtk(parseInt(savedAtk));
    if (savedDef) setBonusDef(parseInt(savedDef));
    if (savedHp) setBonusHp(parseInt(savedHp));
  }, []);

  // Update mobile viewport state
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Save progression helper
  const saveStats = (newWins: number, newLosses: number, newLevel: number, newPoints: number, bAtk: number, bDef: number, bHp: number) => {
    localStorage.setItem('toon_wins', newWins.toString());
    localStorage.setItem('toon_losses', newLosses.toString());
    localStorage.setItem('toon_level', newLevel.toString());
    localStorage.setItem('toon_points', newPoints.toString());
    localStorage.setItem('toon_bonus_atk', bAtk.toString());
    localStorage.setItem('toon_bonus_def', bDef.toString());
    localStorage.setItem('toon_bonus_hp', bHp.toString());
  };

  // Trigger floating combat feedback numbers
  const triggerFloatingText = (text: string, color: string, target: 'player' | 'opponent') => {
    const id = ++floatingIdCounter.current;
    setFloatingText((prev) => [...prev, { id, text, color, target }]);
    setTimeout(() => {
      setFloatingText((prev) => prev.filter((item) => item.id !== id));
    }, 1200);
  };

  // Carousel Navigation
  const navigate = useCallback((direction: 'next' | 'prev') => {
    if (isAnimating || viewState !== 'select') return;
    playSound('click');
    setIsAnimating(true);
    setActiveIndex((prev) => {
      if (direction === 'next') {
        return (prev + 1) % 4;
      } else {
        return (prev + 3) % 4;
      }
    });
    setTimeout(() => {
      setIsAnimating(false);
    }, 650);
  }, [isAnimating, viewState, playSound]);

  // Mystery Capsule Item Luck Spinner
  const spinCapsule = () => {
    if (spinningCapsule) return;
    playSound('click');
    setSpinningCapsule(true);
    
    let spinCount = 0;
    const interval = setInterval(() => {
      setCapsuleItem(LUCKY_ITEMS[Math.floor(Math.random() * LUCKY_ITEMS.length)]);
      playSound('spin');
      spinCount++;
      if (spinCount > 8) {
        clearInterval(interval);
        setSpinningCapsule(false);
      }
    }, 120);
  };

  // Initiate a new battle & Spin Arena Chaos Mutator!
  const startBattle = () => {
    playSound('click');
    setSpinningMutator(true);
    setSelectedMutator(null);
    setViewState('battle');

    // Choose random opponent that is NOT the active player
    let oppIdx = Math.floor(Math.random() * 4);
    while (oppIdx === activeIndex) {
      oppIdx = Math.floor(Math.random() * 4);
    }
    setOpponentIndex(oppIdx);

    // Chaos Mutator Spinner effect
    let spinTicks = 0;
    const mutatorInterval = setInterval(() => {
      setSelectedMutator(CHAOS_MUTATORS[Math.floor(Math.random() * CHAOS_MUTATORS.length)]);
      playSound('spin');
      spinTicks++;
      if (spinTicks > 10) {
        clearInterval(mutatorInterval);
        setSpinningMutator(false);
        // Complete actual setup once mutator is fixed
        applyBattleSetup(oppIdx);
      }
    }, 1500 / 10);
  };

  const applyBattleSetup = (oppIdx: number) => {
    const playerHero = IMAGES[activeIndex];
    const opponentHero = IMAGES[oppIdx];

    // Compute player stats including upgrades + luck items
    let pMaxHp = playerHero.hp + bonusHp;
    let initialBlock = 0;

    if (capsuleItem) {
      if (capsuleItem.type === 'hp') {
        pMaxHp += 30;
      } else if (capsuleItem.type === 'block') {
        initialBlock = 20;
      }
    }

    setPlayerHp(pMaxHp);
    setMaxPlayerHp(pMaxHp);
    setPlayerShield(initialBlock);

    // Set starting energy cap based on Chaos Mutator
    const hasOverflow = selectedMutator?.name.includes('Overflow');
    const startEnergyCap = hasOverflow ? 4 : 3;
    setMaxPlayerEnergy(startEnergyCap);
    setPlayerEnergy(startEnergyCap);

    // Opponent HP scale
    const oMaxHp = Math.round(opponentHero.hp * (1 + (level - 1) * 0.08));
    setOpponentHp(oMaxHp);
    setMaxOpponentHp(oMaxHp);
    setOpponentShield(0);

    setTurn('player');
    setBattleLogs([`⚔️ BATTLE STARTED: ${playerHero.name} VS ${opponentHero.name}! Your turn.`]);
  };

  // Triggering taunts/emotes
  const triggerEmote = (emote: string) => {
    playSound('click');
    setPlayerTaunt(emote);
    setTimeout(() => setPlayerTaunt(null), 2000);

    // Opponent counter reacts funny!
    setTimeout(() => {
      const oppPhrases = [
        "😎 Ha! Missed me!",
        "💥 You talk too much, feel my wrath!",
        "😢 Keep crying, you're going down!",
        "😜 That won't save you!",
        "🔥 Feel the burn!",
      ];
      setOppTaunt(oppPhrases[Math.floor(Math.random() * oppPhrases.length)]);
      setTimeout(() => setOppTaunt(null), 2000);
    }, 1200);
  };

  // Player Turn Action Handlers
  const handlePlayerCard = async (card: any) => {
    if (turn !== 'player' || isAnimating || viewState !== 'battle') return;
    if (playerEnergy < card.cost) {
      triggerFloatingText('OUT OF ENERGY!', 'text-yellow-400', 'player');
      return;
    }

    setIsAnimating(true);
    setPlayerEnergy((prev) => prev - card.cost);

    // Dynamic stat parameters based on upgrades, items, and chaos mutators
    let extraAtkMod = 0;
    if (capsuleItem?.type === 'atk') extraAtkMod += 6;
    if (selectedMutator?.name.includes('Supernova')) extraAtkMod += 12;

    const pAtk = IMAGES[activeIndex].atk + bonusAtk + extraAtkMod;
    const oDef = IMAGES[opponentIndex].def + Math.round((level - 1) * 0.5);

    // Vampiric siphon mutator
    if (selectedMutator?.name.includes('Vampiric')) {
      setPlayerHp((prev) => Math.min(maxPlayerHp, prev + 5));
      triggerFloatingText('+5 Siphon', 'text-pink-300', 'player');
    }

    // 1. Player attack animation
    if (card.type === 'attack' || card.type === 'ultimate') {
      playSound('attack');
      setPlayerAnim('attack');
      setTimeout(() => {
        setOpponentAnim('hit');
        
        let rawDamage = card.value + Math.round(pAtk * 0.2);
        
        // High voltage mutator modifications
        if (selectedMutator?.name.includes('High Voltage') && card.type === 'ultimate') {
          rawDamage = Math.round(rawDamage * 1.5);
          setPlayerHp((p) => Math.max(0, p - 5));
          triggerFloatingText('-5 SelfRecoil', 'text-red-400', 'player');
        }

        // Ultimate recoil or frozen adjustments
        if (card.id === 'f3') { // Supernova deals recoil
          setPlayerHp((prev) => {
            const after = Math.max(0, prev - 8);
            triggerFloatingText('-8 Recoil', 'text-orange-300', 'player');
            return after;
          });
        }
        
        // Block calculation
        let actualDamage = rawDamage;
        setOpponentShield((prevShield) => {
          if (prevShield > 0) {
            if (prevShield >= actualDamage) {
              triggerFloatingText(`BLOCKED! (-0)`, 'text-cyan-200', 'opponent');
              return prevShield - actualDamage;
            } else {
              const extra = actualDamage - prevShield;
              triggerFloatingText(`-${extra} HP`, 'text-red-500', 'opponent');
              setOpponentHp((prevHp) => Math.max(0, prevHp - extra));
              return 0;
            }
          } else {
            triggerFloatingText(`-${actualDamage} HP`, 'text-red-500', 'opponent');
            setOpponentHp((prevHp) => Math.max(0, prevHp - actualDamage));
            return 0;
          }
        });

        setBattleLogs((prev) => [`💥 ${IMAGES[activeIndex].name} casted ${card.name}! Dealt ${rawDamage} DMG.`, ...prev]);
      }, 300);

    } else if (card.type === 'defend') {
      playSound('block');
      setPlayerAnim('shield');
      
      let extraBlockMod = 0;
      if (selectedMutator?.name.includes('Fortified')) extraBlockMod += 10;

      let blockGained = card.value + bonusDef + extraBlockMod;
      setPlayerShield((prev) => prev + blockGained);
      triggerFloatingText(`+${blockGained} Block`, 'text-cyan-300', 'player');

      if (card.id === 'f2') { // Magma shield heals
        setPlayerHp((prev) => {
          const after = Math.min(maxPlayerHp, prev + 6);
          triggerFloatingText('+6 Heal', 'text-emerald-400', 'player');
          return after;
        });
      }
      setBattleLogs((prev) => [`🛡️ ${IMAGES[activeIndex].name} casted ${card.name}! Gained ${blockGained} Block.`, ...prev]);
    } else if (card.id === 'e3') { // Root regrowth (Earth Ultimate)
      playSound('heal');
      setPlayerAnim('heal');
      const healAmt = card.value;
      setPlayerHp((prev) => Math.min(maxPlayerHp, prev + healAmt));
      setPlayerShield((prev) => prev + 10);
      triggerFloatingText(`+${healAmt} Heal`, 'text-emerald-400', 'player');
      triggerFloatingText(`+10 Block`, 'text-cyan-300', 'player');
      setBattleLogs((prev) => [`🌳 ${IMAGES[activeIndex].name} casted ${card.name}! Healed ${healAmt} HP and +10 Block.`, ...prev]);
    }

    // Reset animations
    setTimeout(() => {
      setPlayerAnim('idle');
      setOpponentAnim('idle');
      setIsAnimating(false);
    }, 650);
  };

  // Run game loop turn triggers
  useEffect(() => {
    if (viewState !== 'battle' || spinningMutator) return;

    if (opponentHp <= 0) {
      setTimeout(() => {
        playSound('win');
        // Victory! Save stats & points
        setWins((prev) => {
          const nextWins = prev + 1;
          const nextLevel = Math.floor(nextWins / 2) + 1;
          const nextPoints = upgradePoints + 2; 
          setLevel(nextLevel);
          setUpgradePoints(nextPoints);
          saveStats(nextWins, losses, nextLevel, nextPoints, bonusAtk, bonusDef, bonusHp);
          return nextWins;
        });
        setViewState('victory');
      }, 800);
      return;
    }

    if (playerHp <= 0) {
      setTimeout(() => {
        playSound('lose');
        setLosses((prev) => {
          const nextLosses = prev + 1;
          saveStats(wins, nextLosses, level, upgradePoints, bonusAtk, bonusDef, bonusHp);
          return nextLosses;
        });
        setViewState('defeat');
      }, 800);
      return;
    }

    // AI Turn Handler
    if (turn === 'opponent') {
      const runAiTurn = async () => {
        await new Promise((resolve) => setTimeout(resolve, 1500));
        
        const oppHero = IMAGES[opponentIndex];
        const isLowHp = opponentHp < maxOpponentHp * 0.4;
        const randomRoll = Math.random();

        // 3 Smart options: Shield up when low, otherwise attack!
        let chosenCard = oppHero.cards[0]; // default Attack
        if (isLowHp && randomRoll < 0.6) {
          chosenCard = oppHero.cards[1]; // Defend
        } else if (randomRoll > 0.7) {
          chosenCard = oppHero.cards[2]; // Ultimate
        }

        const oAtk = oppHero.atk + Math.round((level - 1) * 0.6);
        const pDef = IMAGES[activeIndex].def + bonusDef;

        // Perform AI Action
        if (chosenCard.type === 'attack' || chosenCard.type === 'ultimate') {
          playSound('attack');
          setOpponentAnim('attack');
          setTimeout(() => {
            setPlayerAnim('hit');
            let rawDamage = chosenCard.value + Math.round(oAtk * 0.15);
            
            // Recoil or freeze effects
            if (chosenCard.id === 'f3') {
              setOpponentHp((prev) => Math.max(0, prev - 8));
              triggerFloatingText('-8 Recoil', 'text-orange-300', 'opponent');
            }

            let actualDamage = rawDamage;
            setPlayerShield((prevShield) => {
              if (prevShield > 0) {
                if (prevShield >= actualDamage) {
                  triggerFloatingText('BLOCKED!', 'text-cyan-200', 'player');
                  return prevShield - actualDamage;
                } else {
                  const extra = actualDamage - prevShield;
                  triggerFloatingText(`-${extra} HP`, 'text-red-500', 'player');
                  setPlayerHp((prevHp) => Math.max(0, prevHp - extra));
                  return 0;
                }
              } else {
                triggerFloatingText(`-${actualDamage} HP`, 'text-red-500', 'player');
                setPlayerHp((prevHp) => Math.max(0, prevHp - actualDamage));
                return 0;
              }
            });

            setBattleLogs((prev) => [`💥 Opponent ${oppHero.name} used ${chosenCard.name}! Dealt ${rawDamage} DMG.`, ...prev]);
          }, 300);

        } else {
          // AI Defends
          playSound('block');
          setOpponentAnim('shield');
          let blockVal = chosenCard.value + Math.round((level - 1) * 0.5);
          setOpponentShield((prev) => prev + blockVal);
          triggerFloatingText(`+${blockVal} Block`, 'text-cyan-300', 'opponent');

          if (chosenCard.id === 'f2') {
            setOpponentHp((prev) => Math.min(maxOpponentHp, prev + 6));
            triggerFloatingText('+6 Heal', 'text-emerald-400', 'opponent');
          }
          setBattleLogs((prev) => [`🛡️ Opponent ${oppHero.name} used ${chosenCard.name}! Gained ${blockVal} Block.`, ...prev]);
        }

        // Complete Turn transition
        setTimeout(() => {
          setPlayerAnim('idle');
          setOpponentAnim('idle');
          setPlayerEnergy(maxPlayerEnergy); // Recharge energy based on cap
          setTurn('player');
        }, 850);
      };

      runAiTurn();
    }
  }, [turn, opponentHp, playerHp, viewState, spinningMutator, maxPlayerEnergy, playSound]);

  // Turn transitions lock check
  const endPlayerTurn = () => {
    if (turn !== 'player' || isAnimating) return;
    playSound('click');
    setTurn('opponent');
  };

  // Stat point allocation
  const upgradeStat = (stat: 'atk' | 'def' | 'hp') => {
    playSound('click');
    if (upgradePoints <= 0) return;
    let nAtk = bonusAtk;
    let nDef = bonusDef;
    let nHp = bonusHp;

    if (stat === 'atk') nAtk += 2;
    if (stat === 'def') nDef += 2;
    if (stat === 'hp') nHp += 15;

    const nPoints = upgradePoints - 1;
    setBonusAtk(nAtk);
    setBonusDef(nDef);
    setBonusHp(nHp);
    setUpgradePoints(nPoints);
    saveStats(wins, losses, level, nPoints, nAtk, nDef, nHp);
    playSound('heal');
  };

  const resetAllStats = () => {
    playSound('click');
    if (window.confirm('Are you sure you want to reset all game history and custom figurine upgrades?')) {
      setWins(0);
      setLosses(0);
      setLevel(1);
      setUpgradePoints(0);
      setBonusAtk(0);
      setBonusDef(0);
      setBonusHp(0);
      saveStats(0, 0, 1, 0, 0, 0, 0);
    }
  };

  // View Layout calculations
  const playerHero = IMAGES[activeIndex];
  const oppHero = IMAGES[opponentIndex];

  return (
    <div
      id="toonhub-root"
      className="relative w-full h-screen overflow-hidden transition-all duration-650 ease-[cubic-bezier(0.4,0,0.2,1)]"
      style={{
        backgroundColor: viewState === 'select' ? playerHero.bg : '#120d1e',
        fontFamily: '"Inter", sans-serif',
      }}
    >
      {/* 1. Ambient Grain/Noise Overlay */}
      <div
        id="grain-overlay"
        className="absolute inset-0 pointer-events-none z-[80]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.08'/%3E%3C/svg%3E")`,
          opacity: 0.35,
          backgroundSize: '200px 200px',
          backgroundRepeat: 'repeat',
        }}
      />

      {/* Persistent Tiny Header */}
      <div className="absolute top-6 left-4 sm:left-8 right-4 sm:right-8 z-[75] flex justify-between items-center pointer-events-auto">
        <div 
          onClick={() => { playSound('click'); if (viewState === 'select') resetAllStats(); else setViewState('select'); }}
          className="text-xs font-semibold uppercase text-white tracking-[0.18em] cursor-pointer select-none hover:opacity-100 flex items-center gap-1.5"
        >
          <span>TOONHUB</span>
          {viewState !== 'select' && <span className="text-white/40 text-[10px]">/ LEAVE GAME</span>}
        </div>
        
        {/* Level & Trophy Indicator badge */}
        <div className="flex items-center gap-2 sm:gap-4 text-xs font-medium text-white/90">
          <button 
            onClick={() => { setSoundEnabled(!soundEnabled); }}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white cursor-pointer"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
          
          <div className="flex items-center gap-1 bg-white/10 px-2.5 py-1 rounded-full border border-white/10 backdrop-blur-md">
            <Trophy className="w-3.5 h-3.5 text-yellow-400" />
            <span>W: {wins} / L: {losses}</span>
          </div>
          <div className="flex items-center gap-1 bg-white/10 px-2.5 py-1 rounded-full border border-white/10 backdrop-blur-md">
            <Award className="w-3.5 h-3.5 text-cyan-300" />
            <span>LV. {level}</span>
          </div>
        </div>
      </div>

      {/* ==================== 1. MAIN CHARACTER SELECTION VIEW ==================== */}
      {viewState === 'select' && (
        <div className="relative w-full h-full">
          
          {/* Giant background display text */}
          <div
            id="giant-ghost-text"
            className="absolute inset-x-0 flex items-center justify-center pointer-events-none select-none z-[2]"
            style={{
              top: '18%',
              fontFamily: '"Anton", sans-serif',
              fontSize: 'clamp(95px, 28vw, 380px)',
              fontWeight: 900,
              color: 'white',
              opacity: 0.9,
              lineHeight: 1,
              textTransform: 'uppercase',
              letterSpacing: '-0.02em',
              whiteSpace: 'nowrap',
            }}
          >
            3D SHAPE
          </div>

          {/* Pedestal Stand behind figurines */}
          <div
            id="pedestal-panel"
            className="absolute left-1/2 bottom-0 -translate-x-1/2 rounded-full opacity-65 pointer-events-none transition-all duration-650 ease-[cubic-bezier(0.4,0,0.2,1)]"
            style={{
              width: isMobile ? '280px' : '640px',
              height: isMobile ? '70px' : '160px',
              backgroundColor: playerHero.panel,
              zIndex: 2,
              transform: 'translateX(-50%) scaleY(0.42)',
              filter: 'blur(35px)',
            }}
          />

          {/* Carousel figures wrapper */}
          <div id="carousel-container" className="absolute inset-0 z-[10] pointer-events-none">
            {IMAGES.map((img, i) => {
              const role =
                i === activeIndex
                  ? 'center'
                  : i === (activeIndex + 3) % 4
                  ? 'left'
                  : i === (activeIndex + 1) % 4
                  ? 'right'
                  : 'back';
              
              // Role positioning calculations
              let styleObj = {};
              if (role === 'center') {
                styleObj = {
                  transform: `translateX(-50%) scale(${isMobile ? 1.25 : 1.68})`,
                  filter: 'blur(0px)',
                  opacity: 1,
                  zIndex: 20,
                  left: '50%',
                  height: isMobile ? '60%' : '92%',
                  bottom: isMobile ? '22%' : '0px',
                };
              } else if (role === 'left') {
                styleObj = {
                  transform: 'translateX(-50%) scale(1)',
                  filter: 'blur(2px)',
                  opacity: 0.85,
                  zIndex: 10,
                  left: isMobile ? '20%' : '30%',
                  height: isMobile ? '16%' : '28%',
                  bottom: isMobile ? '32%' : '12%',
                };
              } else if (role === 'right') {
                styleObj = {
                  transform: 'translateX(-50%) scale(1)',
                  filter: 'blur(2px)',
                  opacity: 0.85,
                  zIndex: 10,
                  left: isMobile ? '80%' : '70%',
                  height: isMobile ? '16%' : '28%',
                  bottom: isMobile ? '32%' : '12%',
                };
              } else {
                styleObj = {
                  transform: 'translateX(-50%) scale(1)',
                  filter: 'blur(4px)',
                  opacity: 1,
                  zIndex: 5,
                  left: '50%',
                  height: isMobile ? '13%' : '22%',
                  bottom: isMobile ? '32%' : '12%',
                };
              }

              return (
                <div
                  key={i}
                  id={`carousel-item-${i}`}
                  className="transition-all duration-650 ease-[cubic-bezier(0.4,0,0.2,1)]"
                  style={{
                    position: 'absolute',
                    aspectRatio: '0.6 / 1',
                    ...styleObj,
                    willChange: 'transform, filter, opacity',
                  }}
                >
                  <img
                    id={`carousel-img-${i}`}
                    src={img.src}
                    alt={img.name}
                    className="w-full h-full object-contain object-bottom select-none"
                    draggable={false}
                  />
                </div>
              );
            })}
          </div>

          {/* Left panel metadata & controllers */}
          <div
            id="nav-controls"
            className="absolute bottom-6 left-4 sm:bottom-20 sm:left-24 z-[60] max-w-[340px]"
          >
            {/* Character element badge */}
            <div className={`text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 rounded bg-white/10 w-fit mb-2 text-white border border-white/20 backdrop-blur-sm`}>
              {playerHero.element} Specialty
            </div>

            <p
              id="nav-title"
              className="text-white tracking-[0.02em] font-bold uppercase mb-1 sm:mb-2 text-xl sm:text-[32px] leading-tight"
            >
              {playerHero.name}
            </p>
            <p
              id="nav-description"
              className="text-xs sm:text-sm text-white/80 leading-[1.6] mb-4 sm:mb-5 font-normal"
            >
              {playerHero.desc}
            </p>

            {/* Carousel navigation buttons */}
            <div id="nav-buttons" className="flex items-center gap-3 sm:gap-4">
              <button
                id="prev-btn"
                onClick={() => navigate('prev')}
                className="w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center rounded-full border-2 border-white text-white bg-transparent hover:bg-white/12 hover:scale-[1.08] active:scale-95 transition-all duration-150 cursor-pointer outline-none"
                aria-label="Previous figurine"
              >
                <ArrowLeft className="w-[26px] h-[26px]" strokeWidth={2.25} />
              </button>
              <button
                id="next-btn"
                onClick={() => navigate('next')}
                className="w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center rounded-full border-2 border-white text-white bg-transparent hover:bg-white/12 hover:scale-[1.08] active:scale-95 transition-all duration-150 cursor-pointer outline-none"
                aria-label="Next figurine"
              >
                <ArrowRight className="w-[26px] h-[26px]" strokeWidth={2.25} />
              </button>
            </div>
          </div>

          {/* Stat point allocation / Upgrade points */}
          {upgradePoints > 0 && (
            <div className="absolute top-20 left-1/2 -translate-x-1/2 z-[60] bg-purple-950/85 border border-purple-500/30 px-4 py-3 rounded-2xl backdrop-blur-md max-w-[90vw] text-center shadow-xl animate-bounce">
              <p className="text-purple-300 font-bold text-xs uppercase tracking-wider mb-2 flex items-center gap-1 justify-center">
                <Sparkles className="w-3.5 h-3.5 text-yellow-400" /> YOU HAVE {upgradePoints} UNSPENT UPGRADE POINTS!
              </p>
              <div className="flex gap-2 justify-center">
                <button 
                  onClick={() => upgradeStat('atk')}
                  className="bg-orange-500/20 border border-orange-500/40 hover:bg-orange-500/40 text-orange-200 text-xs font-bold px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                >
                  +2 ATK
                </button>
                <button 
                  onClick={() => upgradeStat('def')}
                  className="bg-emerald-500/20 border border-emerald-500/40 hover:bg-emerald-500/40 text-emerald-200 text-xs font-bold px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                >
                  +2 DEF
                </button>
                <button 
                  onClick={() => upgradeStat('hp')}
                  className="bg-cyan-500/20 border border-cyan-500/40 hover:bg-cyan-500/40 text-cyan-200 text-xs font-bold px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                >
                  +15 HP
                </button>
              </div>
            </div>
          )}

          {/* CAPSULE LUCKY SPIN MACHINE */}
          <div className="absolute top-36 sm:top-24 right-4 sm:right-8 z-[60] bg-black/40 border border-white/10 p-4 rounded-2xl backdrop-blur-md max-w-[210px] shadow-2xl">
            <div className="flex items-center gap-1 text-xs font-bold text-yellow-400 mb-1.5">
              <Gift className="w-3.5 h-3.5" />
              <span>CAPSULE LUCK TOY</span>
            </div>
            
            {capsuleItem ? (
              <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-center animate-emote">
                <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-white mb-1">
                  <capsuleItem.icon className={`w-4 h-4 ${capsuleItem.color}`} />
                  <span>{capsuleItem.name}</span>
                </div>
                <p className="text-[10px] text-white/70 leading-normal">{capsuleItem.desc}</p>
                <button 
                  disabled={spinningCapsule}
                  onClick={spinCapsule}
                  className="text-[9px] underline text-cyan-300 hover:text-cyan-200 mt-2 block w-full text-center cursor-pointer"
                >
                  Re-spin Capsule
                </button>
              </div>
            ) : (
              <div className="text-center">
                <p className="text-[10px] text-white/60 mb-2 leading-relaxed">
                  Spin the capsule machine to win a temporary buff for the next match!
                </p>
                <button
                  onClick={spinCapsule}
                  className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-400 hover:to-indigo-500 text-white font-bold text-xs py-2 px-3 rounded-xl transition-all shadow-md cursor-pointer outline-none"
                >
                  SPIN CAPSULE
                </button>
              </div>
            )}
          </div>

          {/* Permanent Upgrades Display */}
          {upgradePoints === 0 && (bonusAtk > 0 || bonusDef > 0 || bonusHp > 0) && (
            <div className="absolute top-20 left-1/2 -translate-x-1/2 z-[60] bg-white/5 border border-white/10 px-4 py-1.5 rounded-full backdrop-blur-md text-xs text-white/70 flex gap-4">
              <span>Permanents:</span>
              {bonusAtk > 0 && <span className="text-orange-400 font-bold">+{bonusAtk} ATK</span>}
              {bonusDef > 0 && <span className="text-emerald-400 font-bold">+{bonusDef} DEF</span>}
              {bonusHp > 0 && <span className="text-cyan-400 font-bold">+{bonusHp} HP</span>}
            </div>
          )}

          {/* 6. Bottom-right link "CHOOSE & BATTLE!" */}
          <div
            id="discover-link-container"
            className="absolute bottom-6 right-4 sm:bottom-20 sm:right-10 z-[60]"
          >
            <button
              id="discover-link"
              onClick={startBattle}
              className="flex items-center gap-2 text-white hover:scale-105 active:scale-95 transition-all duration-200 uppercase no-underline select-none cursor-pointer outline-none group bg-white/10 hover:bg-white/25 px-6 py-4 rounded-2xl border border-white/20 backdrop-blur-md shadow-2xl animate-pulse"
            >
              <span
                style={{
                  fontFamily: '"Anton", sans-serif',
                  fontSize: 'clamp(20px, 3.5vw, 42px)',
                  fontWeight: 400,
                  letterSpacing: '0.02em',
                  lineHeight: 1,
                }}
              >
                CHOOSE & BATTLE!
              </span>
              <Sword
                className="w-5 h-5 sm:w-8 sm:h-8 transition-transform duration-200 group-hover:rotate-12 text-yellow-400"
              />
            </button>
          </div>

        </div>
      )}

      {/* ==================== 2. ARENA / COMBAT BATTLE VIEW ==================== */}
      {viewState === 'battle' && (
        <div className="relative w-full h-full flex flex-col justify-between p-4 sm:p-8 pt-18">
          
          {/* Chaos Mutator Overlay Roller at Start */}
          {spinningMutator && (
            <div className="absolute inset-0 bg-[#0c0a14]/95 z-[90] flex flex-col items-center justify-center p-6 text-center backdrop-blur-sm">
              <div className="w-16 h-16 rounded-full border-4 border-purple-500 border-t-transparent animate-spin mb-6" />
              <p className="text-purple-400 font-bold text-xs uppercase tracking-widest mb-2">
                🎲 Arena Chaos Roller 🎲
              </p>
              <h2 className="font-anton text-4xl sm:text-6xl text-white uppercase tracking-tight mb-2">
                {selectedMutator ? selectedMutator.name : "SPINNING MODIFIERS..."}
              </h2>
              <p className="text-white/70 max-w-sm text-xs sm:text-sm leading-relaxed">
                {selectedMutator ? selectedMutator.desc : "Random battle rules are being selected for this stadium match!"}
              </p>
            </div>
          )}

          {/* Custom Arena Split background blending hero colors */}
          <div className="absolute inset-0 z-1 flex">
            <div className="w-1/2 h-full opacity-35" style={{ background: `radial-gradient(circle at 10% 80%, ${playerHero.bg}, transparent)` }} />
            <div className="w-1/2 h-full opacity-35" style={{ background: `radial-gradient(circle at 90% 20%, ${oppHero.bg}, transparent)` }} />
          </div>

          {/* Dynamic Action Floating Numbers */}
          {floatingText.map((item) => (
            <div
              key={item.id}
              className={`absolute font-black text-2xl sm:text-4xl animate-float-fade z-[90] pointer-events-none drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)] ${item.color}`}
              style={{
                left: item.target === 'player' ? '25%' : '75%',
                top: '40%',
                transform: 'translate(-50%, -50%)',
              }}
            >
              {item.text}
            </div>
          ))}

          {/* Active Chaos Mutator Info Bar */}
          {selectedMutator && !spinningMutator && (
            <div className="absolute top-16 left-1/2 -translate-x-1/2 z-[50] flex items-center gap-2 bg-purple-950/80 border border-purple-500/40 px-4 py-1.5 rounded-full backdrop-blur-md text-[10px] sm:text-xs text-white shadow-lg animate-pulse">
              <span className="font-bold text-yellow-400 uppercase tracking-widest">Active Rule:</span>
              <span className="text-white/90">{selectedMutator.name} — {selectedMutator.desc}</span>
            </div>
          )}

          {/* 1. TOP STATS HEADER: HP / SHIELDS BAR */}
          <div className="w-full grid grid-cols-2 gap-4 sm:gap-12 max-w-5xl mx-auto z-10">
            {/* Player Health Bar */}
            <div className={`p-3 sm:p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md relative ${playerAnim === 'hit' ? 'animate-combat-shake' : ''}`}>
              
              {/* Emote display above player */}
              {playerTaunt && (
                <div className="absolute -top-12 left-6 z-[60] bg-white text-purple-950 text-xs font-extrabold px-3 py-1.5 rounded-2xl shadow-2xl border-2 border-purple-600 animate-emote whitespace-nowrap">
                  {playerTaunt}
                </div>
              )}

              <div className="flex justify-between items-center mb-1">
                <span className="font-bold text-sm sm:text-base text-white flex items-center gap-1.5">
                  {playerHero.name} <span className="text-[10px] bg-cyan-500/20 text-cyan-300 px-1.5 py-0.5 rounded font-mono">LV.{level}</span>
                </span>
                <span className="font-bold text-xs sm:text-sm text-white/90">
                  {playerHp} / {maxPlayerHp} HP
                </span>
              </div>
              <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden relative">
                <div 
                  className="h-full bg-emerald-500 transition-all duration-300"
                  style={{ width: `${Math.max(0, (playerHp / maxPlayerHp) * 100)}%` }}
                />
              </div>
              {/* Shield display */}
              <div className="flex flex-wrap gap-1.5 mt-2">
                {playerShield > 0 && (
                  <span className="text-[10px] font-bold text-cyan-300 flex items-center gap-0.5 bg-cyan-950/50 px-2 py-0.5 rounded border border-cyan-500/30">
                    <ShieldIcon className="w-3 h-3 fill-cyan-400/20" /> Block: {playerShield}
                  </span>
                )}
                <span className="text-[10px] font-bold text-orange-400 flex items-center gap-0.5 bg-orange-950/50 px-2 py-0.5 rounded border border-orange-500/30">
                  Atk: {playerHero.atk + bonusAtk + (capsuleItem?.type === 'atk' ? 6 : 0)} | Def: {playerHero.def + bonusDef}
                </span>
                {capsuleItem && capsuleItem.type !== 'none' && (
                  <span className="text-[9px] font-bold text-yellow-300 flex items-center gap-0.5 bg-yellow-950/40 px-1.5 py-0.5 rounded border border-yellow-500/20">
                    🍀 {capsuleItem.name} Buff
                  </span>
                )}
              </div>
            </div>

            {/* Opponent Health Bar */}
            <div className={`p-3 sm:p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md relative ${opponentAnim === 'hit' ? 'animate-combat-shake' : ''}`}>
              
              {/* Emote display above opponent */}
              {oppTaunt && (
                <div className="absolute -top-12 right-6 z-[60] bg-purple-900 text-white text-xs font-bold px-3 py-1.5 rounded-2xl shadow-2xl border-2 border-pink-500 animate-emote whitespace-nowrap">
                  {oppTaunt}
                </div>
              )}

              <div className="flex justify-between items-center mb-1">
                <span className="font-bold text-xs sm:text-sm text-white/90">
                  {opponentHp} / {maxOpponentHp} HP
                </span>
                <span className="font-bold text-sm sm:text-base text-white flex items-center gap-1.5">
                  <span className="text-[10px] bg-red-500/20 text-red-300 px-1.5 py-0.5 rounded font-mono">OPPONENT</span> {oppHero.name}
                </span>
              </div>
              <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden relative">
                <div 
                  className="h-full bg-red-500 transition-all duration-300 ml-auto"
                  style={{ width: `${Math.max(0, (opponentHp / maxOpponentHp) * 100)}%` }}
                />
              </div>
              {/* Opponent stats info */}
              <div className="flex gap-2 mt-2 justify-end">
                <span className="text-[10px] font-bold text-orange-300 flex items-center gap-0.5 bg-orange-950/50 px-2 py-0.5 rounded border border-orange-500/30">
                  Atk: {oppHero.atk + Math.round((level - 1) * 0.6)} | Def: {oppHero.def + Math.round((level - 1) * 0.5)}
                </span>
                {opponentShield > 0 && (
                  <span className="text-[10px] font-bold text-cyan-300 flex items-center gap-0.5 bg-cyan-950/50 px-2 py-0.5 rounded border border-cyan-500/30">
                    <ShieldIcon className="w-3 h-3 fill-cyan-400/20" /> Block: {opponentShield}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* 2. DYNAMIC DUAL COMBATANTS FIELD */}
          <div className="relative flex-1 w-full flex items-center justify-between max-w-5xl mx-auto z-10 px-4 sm:px-12 my-2">
            
            {/* Player Fighter Figurine */}
            <div 
              className={`relative flex flex-col items-center justify-end w-[40%] h-full max-h-[380px] sm:max-h-[420px] transition-all duration-300 ease-out`}
              style={{
                transform: 
                  playerAnim === 'attack' ? 'translateX(60px) scale(1.15) rotate(6deg)' : 
                  playerAnim === 'hit' ? 'translateX(-25px) rotate(-8deg)' : 'scale(1)',
                filter: playerAnim === 'hit' ? 'brightness(1.5) sepia(0.6) hue-rotate(-50deg)' : 'none'
              }}
            >
              {/* Stand/Glow */}
              <div 
                className="absolute bottom-2 w-32 sm:w-56 h-8 sm:h-12 rounded-full opacity-40 blur-xl animate-pulse"
                style={{ backgroundColor: playerHero.panel }}
              />
              <img 
                src={playerHero.src} 
                alt={playerHero.name} 
                className="w-full h-[85%] object-contain select-none z-10 drop-shadow-[0_12px_24px_rgba(0,0,0,0.6)]"
              />
              {/* Attack trail visual */}
              {playerAnim === 'attack' && (
                <div className="absolute right-0 top-1/4 w-12 h-12 rounded-full bg-white animate-ping opacity-70 z-20" />
              )}
            </div>

            {/* VS CENTER ICON with emote choices below */}
            <div className="flex flex-col items-center justify-center gap-4 z-20">
              <div className="flex flex-col items-center justify-center bg-white/10 border border-white/20 backdrop-blur-md w-12 h-12 sm:w-16 sm:h-16 rounded-full shadow-2xl relative">
                <span className="font-anton text-white text-lg sm:text-2xl italic tracking-widest">VS</span>
                <div className="absolute -inset-0.5 rounded-full border border-purple-500/50 animate-pulse-ring pointer-events-none" />
              </div>

              {/* Emote Panel Controller */}
              <div className="flex gap-1.5 bg-black/40 border border-white/10 p-1.5 rounded-xl backdrop-blur-md">
                {[
                  { face: '😎', label: 'Smug' },
                  { face: '🔥', label: 'Spit Fire' },
                  { face: '😜', label: 'Tease' },
                  { face: '😭', label: 'Sob' }
                ].map((item) => (
                  <button
                    key={item.face}
                    onClick={() => triggerEmote(item.face)}
                    title={item.label}
                    className="hover:scale-125 active:scale-90 transition-transform text-sm sm:text-base cursor-pointer"
                  >
                    {item.face}
                  </button>
                ))}
              </div>
            </div>

            {/* Opponent Fighter Figurine */}
            <div 
              className={`relative flex flex-col items-center justify-end w-[40%] h-full max-h-[380px] sm:max-h-[420px] transition-all duration-300 ease-out`}
              style={{
                transform: 
                  opponentAnim === 'attack' ? 'translateX(-60px) scale(1.15) rotate(-6deg)' : 
                  opponentAnim === 'hit' ? 'translateX(25px) rotate(8deg)' : 'scale(1)',
                filter: opponentAnim === 'hit' ? 'brightness(1.5) sepia(0.6) hue-rotate(-50deg)' : 'none'
              }}
            >
              {/* Stand/Glow */}
              <div 
                className="absolute bottom-2 w-32 sm:w-56 h-8 sm:h-12 rounded-full opacity-40 blur-xl animate-pulse"
                style={{ backgroundColor: oppHero.panel }}
              />
              <img 
                src={oppHero.src} 
                alt={oppHero.name} 
                className="w-full h-[85%] object-contain select-none z-10 scale-x-[-1] drop-shadow-[0_12px_24px_rgba(0,0,0,0.6)]"
              />
              {/* Attack trail visual */}
              {opponentAnim === 'attack' && (
                <div className="absolute left-0 top-1/4 w-12 h-12 rounded-full bg-white animate-ping opacity-70 z-20" />
              )}
            </div>
          </div>

          {/* 3. LOGS, ENERGY & ACTION DECK */}
          <div className="w-full max-w-4xl mx-auto z-10 flex flex-col gap-4">
            
            {/* Ticker Battle Event Log */}
            <div className="w-full h-10 overflow-hidden flex items-center justify-center bg-black/45 border border-white/5 rounded-full px-6 backdrop-blur-sm">
              <span className="text-white/80 text-xs sm:text-sm font-medium tracking-wide truncate">
                {battleLogs[0] || "Get ready to strike..."}
              </span>
            </div>

            {/* Deck & Turn Indicators */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md">
              
              {/* Turn & Energy Indicator */}
              <div className="flex items-center gap-3 sm:flex-col sm:items-start">
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${turn === 'player' ? 'bg-emerald-400 animate-pulse' : 'bg-red-400 animate-pulse'}`} />
                  <span className="text-white font-bold text-xs uppercase tracking-wider">
                    {turn === 'player' ? 'Your Turn' : "Opponent Turn..."}
                  </span>
                </div>
                
                {/* Energy Orbs */}
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-white/50 uppercase tracking-wider font-bold">MANA:</span>
                  {Array.from({ length: maxPlayerEnergy }).map((_, idx) => (
                    <div 
                      key={idx}
                      className={`w-3.5 h-3.5 rounded-full border border-purple-400/40 transition-all duration-300 ${
                        playerEnergy > idx ? 'bg-purple-500 shadow-[0_0_10px_#a855f7]' : 'bg-transparent'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Action Cards Hand */}
              <div className="flex flex-1 justify-center gap-2.5 sm:gap-4 max-w-xl">
                {playerHero.cards.map((card) => {
                  const Icon = card.icon;
                  const isClickable = turn === 'player' && playerEnergy >= card.cost && !isAnimating;

                  return (
                    <button
                      key={card.id}
                      disabled={!isClickable}
                      onClick={() => handlePlayerCard(card)}
                      className={`flex-1 flex flex-col items-center justify-between p-2 sm:p-4 rounded-2xl border transition-all duration-200 outline-none text-left relative overflow-hidden group select-none ${
                        isClickable 
                          ? 'bg-purple-950/40 hover:bg-purple-900/60 border-purple-500/50 hover:scale-[1.04] hover:-translate-y-1.5 cursor-pointer shadow-lg' 
                          : 'bg-black/40 border-white/5 opacity-50 cursor-not-allowed'
                      }`}
                    >
                      {/* Energy cost bubble */}
                      <span className="absolute top-2 right-2 w-5 h-5 rounded-full bg-purple-600/95 flex items-center justify-center font-bold text-[10px] text-white">
                        {card.cost}
                      </span>

                      <div className="flex flex-col items-center gap-1.5 w-full mt-2">
                        <div className="p-1.5 sm:p-2 rounded-xl bg-white/5 border border-white/10 text-white">
                          <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-purple-300" />
                        </div>
                        <span className="font-bold text-[11px] sm:text-xs text-white text-center w-full truncate">
                          {card.name}
                        </span>
                      </div>

                      <p className="hidden sm:block text-[9px] text-white/60 leading-normal text-center mt-2 font-normal line-clamp-2">
                        {card.desc}
                      </p>
                    </button>
                  );
                })}
              </div>

              {/* End Turn Controller */}
              <button
                disabled={turn !== 'player' || isAnimating}
                onClick={endPlayerTurn}
                className={`px-4 sm:px-6 py-3 rounded-2xl font-bold text-xs uppercase tracking-wider flex items-center gap-2 border transition-all duration-150 outline-none select-none ${
                  turn === 'player' && !isAnimating
                    ? 'bg-white text-purple-950 border-white hover:bg-white/90 hover:scale-105 active:scale-95 cursor-pointer'
                    : 'bg-transparent text-white/30 border-white/10 cursor-not-allowed'
                }`}
              >
                <span>End Turn</span>
                <RefreshCw className="w-3.5 h-3.5" />
              </button>

            </div>
          </div>

        </div>
      )}

      {/* ==================== 3. VICTORY OVERLAY SCREEN ==================== */}
      {viewState === 'victory' && (
        <div className="absolute inset-0 z-[95] bg-[#120a1c]/95 flex flex-col items-center justify-center p-6 text-center">
          <div className="absolute w-[450px] h-[450px] bg-emerald-500/10 rounded-full blur-[120px] animate-pulse pointer-events-none" />

          <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 rounded-full text-emerald-300 mb-6 animate-bounce">
            <Trophy className="w-12 h-12" />
          </div>

          <h2 className="font-anton text-5xl sm:text-7xl text-white uppercase tracking-tight mb-2 leading-none">
            VICTORY!
          </h2>
          <p className="text-sm text-emerald-400 font-bold uppercase tracking-widest mb-6">
            Defeated the Opponent Figurine
          </p>

          <div className="bg-white/5 border border-white/10 rounded-3xl p-6 mb-8 max-w-sm w-full backdrop-blur-md">
            <p className="text-white/70 text-xs mb-3">Earned rewards:</p>
            <div className="flex justify-around items-center mb-4">
              <div className="text-center">
                <span className="block font-black text-2xl text-emerald-400">+1</span>
                <span className="text-[10px] text-white/50 uppercase font-bold tracking-wider">WIN</span>
              </div>
              <div className="text-center border-x border-white/10 px-6">
                <span className="block font-black text-2xl text-yellow-400">+2</span>
                <span className="text-[10px] text-white/50 uppercase font-bold tracking-wider">Points</span>
              </div>
              <div className="text-center">
                <span className="block font-black text-2xl text-cyan-400">LV. {level}</span>
                <span className="text-[10px] text-white/50 uppercase font-bold tracking-wider">Level</span>
              </div>
            </div>
            <p className="text-[10px] text-white/40 leading-normal">
              You can spend your reward points on permanent stat multipliers on the character select screen!
            </p>
          </div>

          <button
            onClick={() => { playSound('click'); setViewState('select'); }}
            className="px-8 py-4 rounded-2xl bg-emerald-500 text-white font-bold text-sm uppercase tracking-widest hover:bg-emerald-400 hover:scale-105 active:scale-95 transition-all duration-150 shadow-lg cursor-pointer outline-none"
          >
            CLAIM REWARDS
          </button>
        </div>
      )}

      {/* ==================== 4. DEFEAT OVERLAY SCREEN ==================== */}
      {viewState === 'defeat' && (
        <div className="absolute inset-0 z-[95] bg-[#1a070e]/95 flex flex-col items-center justify-center p-6 text-center">
          <div className="absolute w-[450px] h-[450px] bg-red-500/10 rounded-full blur-[120px] animate-pulse pointer-events-none" />

          <div className="p-3 bg-red-500/20 border border-red-500/40 rounded-full text-red-400 mb-6 animate-pulse">
            <Sword className="w-12 h-12" />
          </div>

          <h2 className="font-anton text-5xl sm:text-7xl text-white uppercase tracking-tight mb-2 leading-none">
            DEFEATED!
          </h2>
          <p className="text-sm text-red-400 font-bold uppercase tracking-widest mb-6">
            Your figurine fell in battle
          </p>

          <div className="bg-white/5 border border-white/10 rounded-3xl p-6 mb-8 max-w-sm w-full backdrop-blur-md">
            <p className="text-white/70 text-xs mb-3">Keep trying to level up!</p>
            <div className="flex justify-around items-center mb-4">
              <div className="text-center">
                <span className="block font-black text-2xl text-red-400">+1</span>
                <span className="text-[10px] text-white/50 uppercase font-bold tracking-wider">LOSS</span>
              </div>
              <div className="text-center border-l border-white/10 pl-6">
                <span className="block font-black text-2xl text-yellow-500">{wins}</span>
                <span className="text-[10px] text-white/50 uppercase font-bold tracking-wider">Total Wins</span>
              </div>
            </div>
            <p className="text-[10px] text-white/40 leading-normal">
              No points earned this time, but every battle makes you stronger. Select your hero and try again!
            </p>
          </div>

          <button
            onClick={() => { playSound('click'); setViewState('select'); }}
            className="px-8 py-4 rounded-2xl bg-red-500 text-white font-bold text-sm uppercase tracking-widest hover:bg-red-400 hover:scale-105 active:scale-95 transition-all duration-150 shadow-lg cursor-pointer outline-none"
          >
            TRY AGAIN
          </button>
        </div>
      )}

    </div>
  );
}
