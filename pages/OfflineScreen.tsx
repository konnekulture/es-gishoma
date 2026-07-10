import React, { useState, useEffect, useRef } from 'react';
import { WifiOff, RotateCcw, Play, Award, Volume2, VolumeX } from 'lucide-react';

interface OfflineScreenProps {
  onRetry: () => void;
}

export default function OfflineScreen({ onRetry }: OfflineScreenProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    try {
      return parseInt(localStorage.getItem('gishoma_game_highscore') || '0', 10);
    } catch {
      return 0;
    }
  });
  const [soundEnabled, setSoundEnabled] = useState(true);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const requestRef = useRef<number | null>(null);

  // Game state references to avoid stale closures in loop
  const gameStateRef = useRef({
    player: { y: 0, vy: 0, height: 40, width: 30, isJumping: false, rotation: 0 },
    obstacles: [] as Array<{ x: number; width: number; height: number; type: 'exam' | 'clock' | 'book'; passed: boolean }>,
    groundY: 150,
    speed: 5,
    frameCount: 0,
    nextObstacleIn: 100,
    score: 0,
    particles: [] as Array<{ x: number; y: number; vx: number; vy: number; color: string; size: number; alpha: number }>
  });

  // Sound Synth using Web Audio API (completely offline-safe, no external assets needed!)
  const playSound = (type: 'jump' | 'score' | 'hit') => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === 'jump') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(150, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
        osc.start();
        osc.stop(ctx.currentTime + 0.15);
      } else if (type === 'score') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
        osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.08); // E5
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);
        osc.start();
        osc.stop(ctx.currentTime + 0.25);
      } else if (type === 'hit') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(220, ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(60, ctx.currentTime + 0.3);
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
        osc.start();
        osc.stop(ctx.currentTime + 0.3);
      }
    } catch (e) {
      console.warn('Audio Synth failed:', e);
    }
  };

  // Jump controller
  const triggerJump = () => {
    const state = gameStateRef.current;
    if (gameOver) {
      restartGame();
      return;
    }
    if (!isPlaying) {
      setIsPlaying(true);
      return;
    }
    if (!state.player.isJumping) {
      state.player.vy = -12;
      state.player.isJumping = true;
      playSound('jump');
    }
  };

  // Keyboard handlers
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'ArrowUp') {
        e.preventDefault();
        triggerJump();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, gameOver]);

  // Restart game helper
  const restartGame = () => {
    setGameOver(false);
    setScore(0);
    setIsPlaying(true);
    gameStateRef.current = {
      player: { y: 0, vy: 0, height: 40, width: 30, isJumping: false, rotation: 0 },
      obstacles: [],
      groundY: 150,
      speed: 6,
      frameCount: 0,
      nextObstacleIn: 80,
      score: 0,
      particles: []
    };
  };

  // Main game loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Responsive sizing
    const resizeCanvas = () => {
      const container = containerRef.current;
      if (container) {
        canvas.width = Math.min(container.clientWidth, 600);
        canvas.height = 200;
        gameStateRef.current.groundY = canvas.height - 40;
      }
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const updateGame = () => {
      const state = gameStateRef.current;
      const player = state.player;

      // Update frame count
      state.frameCount++;

      // Player physics
      player.y += player.vy;
      player.vy += 0.6; // Gravity

      const minPlayerY = state.groundY - player.height;
      if (player.y >= minPlayerY) {
        player.y = minPlayerY;
        player.vy = 0;
        player.isJumping = false;
        player.rotation = 0;
      } else {
        // Soft tilt in mid-air
        player.rotation = Math.min(player.vy * 0.04, 0.5);
      }

      // Progress score based on frames
      if (isPlaying && !gameOver) {
        if (state.frameCount % 5 === 0) {
          state.score += 1;
          setScore(state.score);
          if (state.score % 100 === 0 && state.score > 0) {
            playSound('score');
            state.speed = Math.min(state.speed + 0.5, 12); // Gradually speed up
          }
        }
      }

      // Spawn obstacles
      if (isPlaying && !gameOver && state.frameCount >= state.nextObstacleIn) {
        const types: Array<'exam' | 'clock' | 'book'> = ['exam', 'clock', 'book'];
        const randomType = types[Math.floor(Math.random() * types.length)];
        let obsHeight = 30 + Math.random() * 20;
        let obsWidth = 20 + Math.random() * 15;

        state.obstacles.push({
          x: canvas.width + 20,
          width: obsWidth,
          height: obsHeight,
          type: randomType,
          passed: false
        });

        // Set next spawn frame count
        state.nextObstacleIn = state.frameCount + 60 + Math.random() * 100;
      }

      // Update obstacles
      for (let i = state.obstacles.length - 1; i >= 0; i--) {
        const obs = state.obstacles[i];
        if (isPlaying && !gameOver) {
          obs.x -= state.speed;
        }

        // Collision Check (AABB with slightly reduced hitbox for fair gameplay)
        const pLeft = 40 + 4;
        const pRight = 40 + player.width - 4;
        const pTop = player.y + 4;
        const pBottom = player.y + player.height;

        const oLeft = obs.x + 2;
        const oRight = obs.x + obs.width - 2;
        const oTop = state.groundY - obs.height + 2;
        const oBottom = state.groundY;

        if (pRight > oLeft && pLeft < oRight && pBottom > oTop && pTop < oBottom) {
          // HIT!
          playSound('hit');
          setGameOver(true);
          setIsPlaying(false);

          // Spawn particle explosion
          for (let p = 0; p < 25; p++) {
            state.particles.push({
              x: (pLeft + pRight) / 2,
              y: (pTop + pBottom) / 2,
              vx: (Math.random() - 0.5) * 8,
              vy: (Math.random() - 0.7) * 8,
              color: p % 2 === 0 ? '#4f46e5' : '#f43f5e',
              size: 3 + Math.random() * 4,
              alpha: 1
            });
          }

          // Update High Score
          if (state.score > highScore) {
            setHighScore(state.score);
            try {
              localStorage.setItem('gishoma_game_highscore', state.score.toString());
            } catch (e) {
              console.warn(e);
            }
          }
        }

        // Clean up out of bounds
        if (obs.x < -100) {
          state.obstacles.splice(i, 1);
        }
      }

      // Update particles
      for (let i = state.particles.length - 1; i >= 0; i--) {
        const p = state.particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.2; // Gravity for particles
        p.alpha -= 0.02;
        if (p.alpha <= 0) {
          state.particles.splice(i, 1);
        }
      }
    };

    const drawGame = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const state = gameStateRef.current;
      const player = state.player;

      // Draw Grid/Sky Lines (aesthetic blueprint/school paper effect)
      ctx.strokeStyle = 'rgba(226, 232, 240, 0.6)';
      ctx.lineWidth = 1;
      for (let x = 0; x < canvas.width; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += 40) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Draw Ground
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(0, state.groundY);
      ctx.lineTo(canvas.width, state.groundY);
      ctx.stroke();

      // Draw decorative elements on the ground (little rocks/lines moving)
      ctx.fillStyle = '#cbd5e1';
      const offset = (state.frameCount * (isPlaying ? state.speed : 0)) % 120;
      for (let x = -offset; x < canvas.width; x += 120) {
        ctx.fillRect(x + 10, state.groundY + 8, 15, 3);
        ctx.fillRect(x + 50, state.groundY + 18, 8, 3);
        ctx.fillRect(x + 90, state.groundY + 12, 12, 3);
      }

      // Draw Player (Stylized cute Graduate character 🎓)
      ctx.save();
      const pCenterX = 40 + player.width / 2;
      const pCenterY = player.y + player.height / 2;
      ctx.translate(pCenterX, pCenterY);
      ctx.rotate(player.rotation);

      // Body (Graduation Gown - Elegant Purple/Indigo)
      ctx.fillStyle = '#4f46e5';
      ctx.beginPath();
      ctx.roundRect(-player.width / 2, -player.height / 2, player.width, player.height, [8, 8, 2, 2]);
      ctx.fill();

      // Yellow collar sash
      ctx.fillStyle = '#fbbf24';
      ctx.beginPath();
      ctx.moveTo(-6, -player.height / 2 + 10);
      ctx.lineTo(0, -player.height / 2 + 22);
      ctx.lineTo(6, -player.height / 2 + 10);
      ctx.stroke();

      // Face
      ctx.fillStyle = '#fed7aa';
      ctx.beginPath();
      ctx.arc(0, -12, 10, 0, Math.PI * 2);
      ctx.fill();

      // Graduation Cap (Black Diamond + Yellow Tassel)
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.moveTo(0, -28);
      ctx.lineTo(16, -23);
      ctx.lineTo(0, -18);
      ctx.lineTo(-16, -23);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = '#0f172a';
      ctx.fillRect(-5, -23, 10, 6);

      // Yellow Tassel
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(0, -23);
      ctx.lineTo(-12, -20);
      ctx.lineTo(-12, -15);
      ctx.stroke();

      // Eyes (Cute blink effect or focused eyes)
      ctx.fillStyle = '#1e293b';
      if (gameOver) {
        // Crashing eyes (X X)
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#1e293b';
        ctx.beginPath();
        ctx.moveTo(1, -14); ctx.lineTo(5, -10);
        ctx.moveTo(5, -14); ctx.lineTo(1, -10);
        ctx.moveTo(-5, -14); ctx.lineTo(-1, -10);
        ctx.moveTo(-1, -14); ctx.lineTo(-5, -10);
        ctx.stroke();
      } else {
        // Joyful jumping/running eyes
        ctx.fillRect(1, -14, 3, 3);
        ctx.fillRect(-4, -14, 3, 3);
        // Little smile
        ctx.beginPath();
        ctx.arc(0, -9, 3, 0, Math.PI);
        ctx.stroke();
      }

      ctx.restore();

      // Draw Obstacles (Exams, Books, Alarm Clocks)
      state.obstacles.forEach((obs) => {
        ctx.save();
        ctx.translate(obs.x + obs.width / 2, state.groundY - obs.height / 2);

        if (obs.type === 'exam') {
          // Stylized Exam Paper 📝 with a big red "A+" written
          ctx.fillStyle = '#ffffff';
          ctx.strokeStyle = '#475569';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.roundRect(-obs.width / 2, -obs.height / 2, obs.width, obs.height, 4);
          ctx.fill();
          ctx.stroke();

          // Lines on paper
          ctx.strokeStyle = '#94a3b8';
          ctx.lineWidth = 1.5;
          for (let ly = -obs.height / 2 + 8; ly < obs.height / 2 - 6; ly += 6) {
            ctx.beginPath();
            ctx.moveTo(-obs.width / 2 + 5, ly);
            ctx.lineTo(obs.width / 2 - 5, ly);
            ctx.stroke();
          }

          // Red A+ grade
          ctx.fillStyle = '#f43f5e';
          ctx.font = 'bold 11px system-ui';
          ctx.fillText('A+', obs.width / 2 - 14, -obs.height / 2 + 13);
        } else if (obs.type === 'book') {
          // Thick red or orange textbook 📚
          ctx.fillStyle = '#f97316';
          ctx.beginPath();
          ctx.roundRect(-obs.width / 2, -obs.height / 2, obs.width - 4, obs.height, [4, 1, 1, 4]);
          ctx.fill();

          // Pages showing on side
          ctx.fillStyle = '#f1f5f9';
          ctx.fillRect(obs.width / 2 - 4, -obs.height / 2 + 2, 4, obs.height - 4);

          // Spine stripes
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(-obs.width / 2 + 2, -obs.height / 2 + 6, 4, 3);
          ctx.fillRect(-obs.width / 2 + 2, obs.height / 2 - 9, 4, 3);
        } else {
          // Alarm clock ⏰
          ctx.fillStyle = '#3b82f6';
          ctx.beginPath();
          ctx.arc(0, 2, obs.width / 2 - 2, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = '#0f172a';
          ctx.lineWidth = 1.5;
          ctx.stroke();

          // White dial
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(0, 2, obs.width / 2 - 6, 0, Math.PI * 2);
          ctx.fill();

          // Bell ears
          ctx.fillStyle = '#475569';
          ctx.beginPath();
          ctx.arc(-obs.width / 2 + 3, -obs.height / 2 + 8, 5, 0, Math.PI * 2);
          ctx.arc(obs.width / 2 - 3, -obs.height / 2 + 8, 5, 0, Math.PI * 2);
          ctx.fill();

          // Hands
          ctx.strokeStyle = '#0f172a';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(0, 2);
          ctx.lineTo(0, -obs.height / 4);
          ctx.moveTo(0, 2);
          ctx.lineTo(obs.width / 5, 2);
          ctx.stroke();
        }

        ctx.restore();
      });

      // Draw Particles
      state.particles.forEach((p) => {
        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });
    };

    const runLoop = () => {
      updateGame();
      drawGame();
      requestRef.current = requestAnimationFrame(runLoop);
    };

    requestRef.current = requestAnimationFrame(runLoop);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [isPlaying, gameOver, soundEnabled]);

  return (
    <div className="fixed inset-0 bg-slate-900 z-[999] flex flex-col justify-center items-center p-4 overflow-y-auto">
      {/* Offline Message Header */}
      <div className="max-w-md w-full bg-slate-800 rounded-2xl border border-slate-700/60 p-6 sm:p-8 text-center shadow-2xl relative overflow-hidden shrink-0 mb-6">
        {/* Animated grid lines behind */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none" />

        <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto mb-5 text-red-400 border border-red-500/20 relative">
          <WifiOff className="w-8 h-8 animate-bounce" />
          <span className="absolute -top-1 -right-1 flex h-3.  w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-none mb-3 brand-font">
          You are Offline
        </h1>
        
        <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6">
          ES GISHOMA requires an active internet connection. Please connect to your network and try again.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={onRetry}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white font-bold rounded-xl text-sm transition-all shadow-lg flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Check Connection
          </button>
        </div>
      </div>

      {/* Retro Dino-Style Jumper Game Canvas container */}
      <div 
        ref={containerRef}
        className="max-w-xl w-full bg-slate-800 border border-slate-700/60 rounded-2xl p-4 shadow-xl text-center relative overflow-hidden"
      >
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center space-x-2">
            <span className="text-[10px] uppercase font-bold tracking-widest text-indigo-400">Offline Mini Game</span>
          </div>

          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-700 transition-colors"
              title={soundEnabled ? 'Mute Sound' : 'Unmute Sound'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            <div className="flex items-center space-x-3 text-xs font-mono">
              <span className="text-slate-400 flex items-center gap-1">
                <Award className="w-3.5 h-3.5 text-amber-400" />
                HI: <span className="text-slate-200 font-bold">{highScore}</span>
              </span>
              <span className="text-slate-400">
                SCORE: <span className="text-white font-bold">{score}</span>
              </span>
            </div>
          </div>
        </div>

        {/* The Game Canvas */}
        <div className="relative bg-slate-950 rounded-xl overflow-hidden border border-slate-900 touch-none">
          <canvas 
            ref={canvasRef} 
            onClick={triggerJump}
            className="w-full h-[200px] block cursor-pointer"
          />

          {/* Game Over Screen Overlay */}
          {gameOver && (
            <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm flex flex-col items-center justify-center text-center p-4">
              <span className="text-red-500 text-sm uppercase font-extrabold tracking-widest mb-1">Game Over</span>
              <h3 className="text-white text-xl font-black mb-3">You crashed!</h3>
              <button
                onClick={restartGame}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg flex items-center gap-2 shadow-md transition-all active:scale-95"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Play Again
              </button>
            </div>
          )}

          {/* Initial Play Overlay */}
          {!isPlaying && !gameOver && (
            <div className="absolute inset-0 bg-slate-950/70 flex flex-col items-center justify-center text-center p-4">
              <p className="text-indigo-300 text-xs font-bold uppercase tracking-widest mb-3">Help the student graduate!</p>
              <button
                onClick={triggerJump}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg flex items-center gap-2 shadow-lg hover:scale-105 active:scale-95 transition-all"
              >
                <Play className="w-3.5 h-3.5" />
                TAP TO PLAY
              </button>
              <p className="text-slate-400 text-[10px] mt-3">
                Tap spacebar, up arrow, or click the screen to jump over incoming exam books!
              </p>
            </div>
          )}
        </div>

        <p className="text-slate-400 text-xs mt-3">
          Tip: Standard internet rates apply once online. Complete your tasks when connected!
        </p>
      </div>
    </div>
  );
}
