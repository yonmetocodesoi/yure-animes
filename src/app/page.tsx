
'use client';

import { useState, useMemo, useEffect } from 'react';
import {
  Search, Play, Tv, Loader2, AlertCircle, ExternalLink, Info,
  ArrowLeft, Star, Clock, ChevronRight, Home as HomeIcon,
  Compass, Heart, History, Settings, LogOut, LayoutGrid, List
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const INITIAL_CATALOG = [
  {
    mediaId: 21, // One Piece
    title: "One Piece",
    tmdbId: "37854",
    slug: "one-piece",
    dubSlug: "one-piece-dublado",
    image: "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx21-YCDuy1eJYxhu.jpg",
    category: "Aventura",
    rating: "4.9",
    status: "Lançamento",
    description: "Acompanhe Luffy e sua tripulação na busca pelo tesouro supremo em um mundo vasto e cheio de mistérios.",
    dubbedAvailable: true,
    type: "serie"
  },
  {
    mediaId: 21175, // Dragon Ball Super
    title: "Dragon Ball Super",
    tmdbId: "62715",
    slug: "dragon-ball-super",
    dubSlug: "dragon-ball-super-dublado",
    image: "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx21175-v4r77saodV0I.jpg",
    category: "Shonen",
    rating: "4.8",
    status: "Finalizado",
    description: "Goku e seus amigos enfrentam inimigos de outros universos e alcançam novos níveis de poder divino.",
    dubbedAvailable: true,
    type: "serie"
  },
  {
    mediaId: 151807, // Solo Leveling (Updated)
    title: "Solo Leveling",
    tmdbId: "141315",
    slug: "solo-leveling",
    dubSlug: "solo-leveling-dublado",
    image: "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx151801-9Uf76S67vK9L.jpg",
    category: "Ação / Fantasia",
    rating: "9.1",
    status: "Dublado",
    description: "Em um mundo onde caçadores enfrentam monstros, Sung Jin-woo é o mais fraco até encontrar um segredo.",
    dubbedAvailable: true,
    type: "serie"
  },
  {
    mediaId: 1735, // Naruto Shippuden (Updated)
    title: "Naruto Shippuden",
    tmdbId: "31910",
    slug: "naruto-shippuden",
    dubSlug: "naruto-shippuden-dublado",
    image: "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx1735-8p8YvN2lD6u7.png",
    category: "Ação / Aventura",
    rating: "8.6",
    status: "Dublado",
    description: "Naruto retorna após anos de treinamento para salvar o mundo shinobi de uma ameaça terrível.",
    dubbedAvailable: true,
    type: "serie"
  },
  {
    mediaId: 127230, // Chainsaw Man (New)
    title: "Chainsaw Man",
    tmdbId: "114410",
    slug: "chainsaw-man",
    dubSlug: "chainsaw-man-dublado",
    image: "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx127230-mY7cs99p6S6O.png",
    rating: "8.7",
    category: "Ação / Terror",
    status: "Dublado",
    description: "Denji, um jovem endividado, revive como o Homem-Motosserra e caça demônios para sobreviver.",
    dubbedAvailable: true,
    type: "serie"
  },
  {
    mediaId: 140960, // Spy x Family (New)
    title: "Spy x Family",
    tmdbId: "120089",
    slug: "spy-x-family",
    dubSlug: "spy-x-family-dublado",
    image: "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx140960-vY60o4UfA02L.jpg",
    rating: "8.6",
    category: "Comédia / Espionagem",
    status: "Dublado",
    description: "Um espião cria uma família falsa sem saber que sua esposa é uma assassina e sua filha uma telepata.",
    dubbedAvailable: true,
    type: "serie"
  },
  {
    mediaId: 97940, // Black Clover (Updated)
    title: "Black Clover",
    tmdbId: "73223",
    slug: "black-clover",
    dubSlug: "black-clover-dublado",
    image: "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/nx97940-9Sgo6hG6H3C6.jpg",
    category: "Ação / Magia",
    rating: "8.5",
    status: "Dublado",
    description: "Asta, o único garoto sem magia do reino, luta para se tornar o Rei Mago com sua anti-magia.",
    dubbedAvailable: true,
    type: "serie"
  },
  {
    mediaId: 20464, // Haikyuu!! (New)
    title: "Haikyuu!!",
    tmdbId: "60634",
    slug: "haikyuu",
    dubSlug: "haikyuu-legendado", // Assuming a default for new entries
    image: "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx20464-m7D7zInG9063.jpg",
    rating: "8.8",
    category: "Esportes / Vôlei",
    status: "Legendado",
    description: "A jornada inspiradora de uma equipe de vôlei improvável rumo ao topo do Japão.",
    dubbedAvailable: false,
    type: "serie"
  },
  {
    mediaId: 85937, // Demon Slayer
    title: "Demon Slayer (Kimetsu no Yaiba)",
    tmdbId: "85937",
    slug: "kimetsu-no-yaiba",
    dubSlug: "kimetsu-no-yaiba-dublado",
    image: "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx101922-W6Fbe7du6Yid.jpg",
    category: "Ação / Fantasia",
    rating: "8.9",
    status: "Dublado",
    description: "Tanjiro Kamado luta contra demônios para curar sua irmã e vingar sua família.",
    dubbedAvailable: true,
    type: "serie"
  },
  {
    mediaId: 13916, // Death Note
    title: "Death Note",
    tmdbId: "13916",
    slug: "death-note",
    dubSlug: "death-note-dublado",
    image: "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx1535-fU7pYm9nSst4.jpg",
    category: "Mistério / Suspense",
    rating: "9.0",
    status: "Dublado",
    description: "Um estudante encontra um caderno que mata quem tem o nome escrito nele.",
    dubbedAvailable: true,
    type: "serie"
  },
  {
    mediaId: 46298, // Hunter x Hunter
    title: "Hunter x Hunter (2011)",
    tmdbId: "46298",
    slug: "hunter-x-hunter-2011",
    dubSlug: "hunter-x-hunter-2011-dublado",
    image: "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx11061-vOidvaS88q7Z.jpg",
    category: "Aventura / Shonen",
    rating: "9.1",
    status: "Dublado",
    description: "Gon Freecss busca se tornar um Hunter para encontrar seu pai desaparecido.",
    dubbedAvailable: true,
    type: "serie"
  },
  {
    mediaId: 120, // Fullmetal Alchemist: Brotherhood
    title: "Fullmetal Alchemist: Brotherhood",
    tmdbId: "31845",
    slug: "fullmetal-alchemist-brotherhood",
    dubSlug: "fullmetal-alchemist-brotherhood-dublado",
    image: "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx5114-KJTCD9r8it6j.jpg",
    category: "Aventura / Drama",
    rating: "9.2",
    status: "Dublado",
    description: "Dois irmãos buscam a Pedra Filosofal para recuperar seus corpos após um ritual proibido.",
    dubbedAvailable: true,
    type: "serie"
  },
  {
    mediaId: 110277, // Hell's Paradise
    title: "Hell's Paradise",
    tmdbId: "116480",
    slug: "jigokuraku",
    dubSlug: "jigokuraku-dublado",
    image: "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx128893-XvjntmY3yOkq.jpg",
    category: "Ação / Sobrenatural",
    rating: "8.4",
    status: "Dublado",
    description: "Um ninja condenado busca o elixir da imortalidade em uma ilha misteriosa.",
    dubbedAvailable: true,
    type: "serie"
  },
  {
    mediaId: 16498, // Attack on Titan
    title: "Attack on Titan",
    tmdbId: "1429",
    slug: "shingeki-no-kyojin",
    dubSlug: "shingeki-no-kyojin-dublado",
    image: "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx16498-73pe7m6Z2BR9.jpg",
    category: "Ação / Drama",
    rating: "9.1",
    status: "Dublado",
    description: "A humanidade luta pela sobrevivência contra gigantes devoradores de homens.",
    dubbedAvailable: true,
    type: "serie"
  },
  {
    mediaId: 21087, // One Punch Man
    title: "One Punch Man",
    tmdbId: "63926",
    slug: "one-punch-man",
    dubSlug: "one-punch-man-dublado",
    image: "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx21087-vclZSbm89XpU.jpg",
    rating: "8.7",
    category: "Comédia / Ação",
    status: "Dublado",
    description: "Saitama é um herói tão forte que derrota qualquer um com apenas um soco.",
    dubbedAvailable: true,
    type: "serie"
  },
  {
    mediaId: 113415, // Jujutsu Kaisen
    title: "Jujutsu Kaisen",
    tmdbId: "95479",
    slug: "jujutsu-kaisen",
    dubSlug: "jujutsu-kaisen-dublado",
    image: "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx113415-bbBWj4biBvcs.jpg",
    rating: "8.8",
    category: "Ação / Sobrenatural",
    status: "Dublado",
    description: "Yuji Itadori engole um dedo amaldiçoado e entra no perigoso mundo dos feiticeiros jujutsu.",
    dubbedAvailable: true,
    type: "serie"
  },
  {
    mediaId: 269, // Bleach
    title: "Bleach",
    tmdbId: "30982",
    slug: "bleach",
    dubSlug: "bleach-dublado",
    image: "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx269-6Kno0L67m7T0.jpg",
    category: "Ação / Sobrenatural",
    status: "Dublado",
    description: "Ichigo Kurosaki ganha poderes de um Shinigami e deve proteger o mundo dos Hollows.",
    dubbedAvailable: true,
    type: "serie"
  },
  {
    mediaId: 127881, // Jujutsu Kaisen 0
    title: "Jujutsu Kaisen 0",
    tmdbId: "912316",
    slug: "jujutsu-kaisen-0-o-filme",
    dubSlug: "jujutsu-kaisen-0-o-filme-dublado",
    image: "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx127881-tY88888.jpg",
    category: "Filme",
    rating: "4.8",
    status: "Filme",
    description: "Yuta Okkotsu entra na Escola de Feitiçaria após ser amaldiçoado por sua amiga de infância.",
    dubbedAvailable: true,
    type: "movie"
  },
  {
    mediaId: 113415, // Jujutsu Kaisen
    title: "Jujutsu Kaisen",
    tmdbId: "95479",
    slug: "jujutsu-kaisen",
    dubSlug: "jujutsu-kaisen-dublado",
    image: "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx113415-bbBWj4pEfseh.jpg",
    category: "Sobrenatural",
    rating: "4.9",
    status: "Em Alta",
    description: "Maldições, feitiçaria e lutas intensas para proteger o mundo do caos.",
    dubbedAvailable: true,
    type: "serie"
  },
  {
    mediaId: 112151, // Demon Slayer: Mugen Train
    title: "Demon Slayer: Mugen Train",
    tmdbId: "635302",
    slug: "kimetsu-no-yaiba-mugen-ressha-hen",
    dubSlug: "kimetsu-no-yaiba-mugen-ressha-hen-dublado",
    image: "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx112151-6Vv782.jpg",
    category: "Ação",
    rating: "4.9",
    status: "Filme",
    description: "Tanjiro e seus amigos acompanham o Hashira das Chamas no Trem Infinito.",
    dubbedAvailable: true,
    type: "movie"
  },
  {
    mediaId: 21519, // Your Name
    title: "Your Name",
    tmdbId: "372058",
    slug: "kimi-no-na-wa",
    dubSlug: "kimi-no-na-wa-dublado",
    image: "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx21519-99999999.jpg",
    category: "Drama",
    rating: "4.9",
    status: "Filme",
    description: "Dois estranhos se veem conectados de uma maneira bizarra.",
    dubbedAvailable: true,
    type: "movie"
  },
  {
    mediaId: 145928, // Suzume
    title: "Suzume no Tojimari",
    tmdbId: "916224",
    slug: "suzume-no-tojimari",
    dubSlug: "suzume-no-tojimari-dublado",
    image: "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx145928-8Hj781.jpg",
    category: "Fantasia",
    rating: "4.9",
    status: "Filme",
    description: "Uma jovem ajuda a fechar portas que liberam desastres pelo Japão.",
    dubbedAvailable: true,
    type: "movie"
  },
  {
    mediaId: 142144, // One Piece Film Red
    title: "One Piece Film Red",
    tmdbId: "900667",
    slug: "one-piece-filme-red",
    dubSlug: "one-piece-filme-red-dublado",
    image: "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx142144-8Yv782.jpg",
    category: "Aventura",
    rating: "4.8",
    status: "Filme",
    description: "Uta, a cantora mais amada do mundo, se revela pela primeira vez.",
    dubbedAvailable: true,
    type: "movie"
  },
  {
    mediaId: 114446, // Bleach TYBW
    title: "Bleach: Thousand-Year Blood War",
    tmdbId: "204541",
    slug: "bleach-thousand-year-blood-war",
    dubSlug: "bleach-thousand-year-blood-war-dublado",
    image: "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx114446-U8R5L1.jpg",
    category: "Ação",
    rating: "4.9",
    status: "Lançamento",
    description: "A saga final de Bleach, focada na guerra entre Shinigamis e Quincies.",
    dubbedAvailable: true,
    type: "serie"
  },
  {
    mediaId: 16498, // Attack on Titan
    title: "Attack on Titan",
    tmdbId: "1429",
    slug: "shingeki-no-kyojin",
    dubSlug: "shingeki-no-kyojin-dublado",
    image: "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx16498-CXofI6.jpg",
    category: "Drama",
    rating: "4.9",
    status: "Finalizado",
    description: "A humanidade luta pela sobrevivência contra gigantes devoradores de homens.",
    dubbedAvailable: true,
    type: "serie"
  },
  {
    mediaId: 11061, // Hunter x Hunter
    title: "Hunter x Hunter (2011)",
    tmdbId: "46298",
    slug: "hunter-x-hunter-2011",
    dubSlug: "hunter-x-hunter-2011-dublado",
    image: "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx11061-6H0O6B.jpg",
    category: "Aventura",
    rating: "4.9",
    status: "Clássico",
    description: "Gon Freecss busca se tornar um Hunter para encontrar seu pai desaparecido.",
    dubbedAvailable: true,
    type: "serie"
  },
  {
    mediaId: 101922, // Demon Slayer
    title: "Demon Slayer: Kimetsu no Yaiba",
    tmdbId: "85350",
    slug: "kimetsu-no-yaiba",
    dubSlug: "kimetsu-no-yaiba-dublado",
    image: "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx101922-W3F3sM.jpg",
    category: "Ação",
    rating: "4.9",
    status: "Em Alta",
    description: "Tanjiro se torna um caçador de demônios para salvar sua irmã Nezuko.",
    dubbedAvailable: true,
    type: "serie"
  },
  {
    mediaId: 21459, // My Hero Academia
    title: "My Hero Academia",
    tmdbId: "65930",
    slug: "boku-no-hero-academia",
    dubSlug: "boku-no-hero-academia-dublado",
    image: "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx21459-YkXySx.jpg",
    category: "Super-herói",
    rating: "4.8",
    status: "Lançamento",
    description: "Em um mundo onde quase todos têm superpoderes, um jovem sem poderes luta para se tornar um herói.",
    dubbedAvailable: true,
    type: "serie"
  },
  {
    mediaId: 1535, // Death Note
    tmdbId: "13916",
    title: "Death Note",
    slug: "death-note",
    dubSlug: "death-note-dublado",
    image: "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx1535-4l8A6B.jpg",
    category: "Mistério",
    rating: "4.8",
    status: "Obra-prima",
    description: "Um estudante encontra um caderno que mata qualquer pessoa cujo nome seja escrito nele.",
    dubbedAvailable: true,
    type: "serie"
  },
  {
    mediaId: 5114, // Fullmetal Alchemist
    title: "Fullmetal Alchemist: Brotherhood",
    tmdbId: "31845",
    slug: "fullmetal-alchemist-brotherhood",
    dubSlug: "fullmetal-alchemist-brotherhood-dublado",
    image: "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx5114-6H0O6B.jpg",
    category: "Ação",
    rating: "4.9",
    status: "Finalizado",
    description: "Dois irmãos buscam a Pedra Filosofal para recuperar seus corpos após um experimento fracassado.",
    dubbedAvailable: true,
    type: "serie"
  },
  {
    mediaId: 9253, // Steins;Gate
    title: "Steins;Gate",
    tmdbId: "36871",
    slug: "steins-gate",
    image: "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx9253-6H0O6B.jpg",
    category: "Sci-Fi",
    rating: "4.9",
    status: "Clássico",
    description: "Um cientista excêntrico descobre acidentalmente uma maneira de enviar mensagens para o passado.",
    dubbedAvailable: false,
    type: "serie"
  }
];

export default function Home() {
  const [view, setView] = useState<'catalog' | 'watch'>('catalog');
  // Initialize with the static catalog, but it will be updated by the effect
  const [animeList, setAnimeList] = useState(INITIAL_CATALOG);
  const [selectedAnime, setSelectedAnime] = useState<any>(null);
  const [season, setSeason] = useState('1');
  const [episode, setEpisode] = useState('1');
  const [audio, setAudio] = useState<'sub' | 'dub'>('sub');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<any[]>([]);
  const [globalResults, setGlobalResults] = useState<any[]>([]);
  const [activeVideo, setActiveVideo] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCatalog = useMemo(() =>
    animeList.filter(a => a.title.toLowerCase().includes(searchQuery.toLowerCase())),
    [searchQuery, animeList]
  );

  // Global search effect
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchQuery.length > 2) {
        try {
          const res = await fetch(`/api/search/${encodeURIComponent(searchQuery)}`);
          const data = await res.json();
          if (!data.error) setGlobalResults(data.data);
        } catch (e) {
          console.error("Global search failed", e);
        }
      } else {
        setGlobalResults([]);
      }
    }, 800);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const fetchEpisode = async (animeSlug?: string, epNum?: string, seaNum?: string, audioType?: 'sub' | 'dub', currentSelected?: any) => {
    let baseSlug = animeSlug || selectedAnime?.slug;
    if (baseSlug?.endsWith('-dublado')) baseSlug = baseSlug.replace('-dublado', '');

    const activeAnime = currentSelected || selectedAnime;
    const currentEp = epNum || episode;
    const currentSea = seaNum || season;
    const currentAudio = audioType || audio;

    if (!baseSlug) return;

    setLoading(true);
    setError(null);
    setActiveVideo(null);
    setResults([]);

    let slugsToTry: string[] = [];

    if (currentAudio === 'dub') {
      const explicitDubSlug = activeAnime?.dubSlug || animeList.find((a: any) => a.slug === baseSlug)?.dubSlug;
      if (explicitDubSlug) slugsToTry.push(explicitDubSlug);

      slugsToTry.push(`${baseSlug}-dublado`);
      slugsToTry.push(`${baseSlug}-dub`);
    } else {
      slugsToTry.push(baseSlug);
    }

    try {
      let foundData = null;

      // 1. Tentar o Servidor Local (PC) - Prioridade para o celular acessar
      try {
        const LOCAL_SERVER = 'https://sugoi-br-api.loca.lt'; // Novo túnel estável
        for (const s of slugsToTry) {
          const localRes = await fetch(`${LOCAL_SERVER}/api/episode/${s}/${currentSea}/${currentEp}?tmdbId=${activeAnime?.tmdbId || ''}&type=${activeAnime?.type || 'serie'}`);
          if (localRes.ok) {
            const localData = await localRes.json();
            if (localData.data && localData.data.length > 0) {
              foundData = localData.data.map((r: any) => ({ ...r, name: `VIP MASTER BR - ${r.name}` }));
              if (localData.tmdbId && activeAnime && !activeAnime.tmdbId) {
                setSelectedAnime({ ...activeAnime, tmdbId: localData.tmdbId });
              }
              break;
            }
          }
        }
      } catch (e) {
        // Ignora erro se o servidor local não estiver rodando
      }

      if (!foundData) {
        // 2. Tentar o Servidor Cloud (Render - acessível por todos!)
        const CLOUD_SERVER = 'https://serveranimesite.onrender.com';
        for (const s of slugsToTry) {
          try {
            const cloudRes = await fetch(`${CLOUD_SERVER}/api/episode/${s}/${currentSea}/${currentEp}?tmdbId=${activeAnime?.tmdbId || ''}&type=${activeAnime?.type || 'serie'}`);
            if (cloudRes.ok) {
              const cloudData = await cloudRes.json();
              if (cloudData.data && cloudData.data.length > 0) {
                foundData = cloudData.data.map((r: any) => ({ ...r, name: `Local (Render) - ${r.name}` }));
                if (cloudData.tmdbId && activeAnime && !activeAnime.tmdbId) {
                  setSelectedAnime({ ...activeAnime, tmdbId: cloudData.tmdbId });
                }
                break;
              }
            }
          } catch (e) { }
        }
      }

      // 2. Fallback: API interna do Netlify
      if (!foundData) {
        for (const s of slugsToTry) {
          try {
            const res = await fetch(`/api/episode/${s}/${currentSea}/${currentEp}?tmdbId=${activeAnime?.tmdbId || ''}&type=${activeAnime?.type || 'serie'}`);
            const data = await res.json();
            if (data.data && data.data.length > 0) {
              foundData = data.data;
              if (data.tmdbId && activeAnime && !activeAnime.tmdbId) {
                setSelectedAnime({ ...activeAnime, tmdbId: data.tmdbId });
              }
              break;
            }
          } catch (e) { }
        }
      }

      if (foundData && foundData.length > 0) {
        setResults(foundData);
        const first = foundData.find((r: any) => r.episodes[0] && !r.episodes[0].error && r.episodes[0].episode);
        if (first) setActiveVideo(first.episodes[0].episode);
        else setActiveVideo(foundData[0].episodes[0].episode);
      } else {
        setError(currentAudio === 'dub' ? 'Versão dublada não encontrada.' : 'Episódio não encontrado.');
        setResults([]);
      }
    } catch (err) {
      setError('Erro de conexão.');
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const resolveTmdbId = async (title: string) => {
    try {
      const query = `
        query ($search: String) {
          Media(search: $search, type: ANIME) {
            id
            idMal
            idTales
            title { english romaji }
          }
        }
      `;
      const response = await fetch('https://graphql.anilist.co', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, variables: { search: title } })
      });
      const data = await response.json();
      const media = data.data?.Media;
      if (media?.idMal) return media.idMal.toString(); // Usar ID do MyAnimeList como fallback pro TMDB em muitos players
      return null;
    } catch (e) {
      return null;
    }
  };

  const [trendingAnimes, setTrendingAnimes] = useState<any[]>([]);
  const [popularAnimes, setPopularAnimes] = useState<any[]>([]);
  const [dubbedAnimes, setDubbedAnimes] = useState<any[]>([]);

  // Fetch dynamic catalog from AniList (GraphQL) - Better quality images and integrated data
  useEffect(() => {
    const fetchCatalog = async () => {
      const query = `
        query {
          trending: Page(page: 1, perPage: 15) {
            media(sort: TRENDING_DESC, type: ANIME, isAdult: false) {
              id
              title { romaji english }
              coverImage { extraLarge large }
              bannerImage
              averageScore
              genres
              description
              status
            }
          }
          popular: Page(page: 1, perPage: 15) {
            media(sort: POPULAR_DESC, type: ANIME, isAdult: false) {
              id
              title { romaji english }
              coverImage { extraLarge large }
              averageScore
              genres
              description
            }
          }
          dubbed: Page(page: 1, perPage: 15) {
            media(sort: SCORE_DESC, type: ANIME, countryOfOrigin: "JP", isAdult: false) {
              id
              title { romaji english }
              coverImage { extraLarge large }
              averageScore
              genres
              description
            }
          }
        }
      `;

      try {
        const response = await fetch('https://graphql.anilist.co', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query })
        });
        const result = await response.json();
        const data = result.data;

        const mapAniList = (list: any[]) => list.map(a => ({
          title: a.title.english || a.title.romaji,
          mediaId: a.id,
          slug: (a.title.english || a.title.romaji).toLowerCase().replace(/ /g, '-').replace(/[^\w-]/g, ''),
          image: a.coverImage.extraLarge || a.coverImage.large,
          rating: (a.averageScore / 10).toFixed(1),
          category: a.genres[0] || 'Anime',
          status: a.status || 'Finalizado',
          description: a.description?.replace(/<[^>]*>/g, '') || '',
          type: 'serie'
        }));

        setTrendingAnimes(mapAniList(data.trending.media));
        setPopularAnimes(mapAniList(data.popular.media));

        // Use a mix of static known-dubbed and high-rated from AniList
        const dubbedFromAniList = mapAniList(data.dubbed.media);
        setDubbedAnimes([...INITIAL_CATALOG.filter(a => a.dubbedAvailable), ...dubbedFromAniList].slice(0, 15));

      } catch (err) {
        console.error("AniList Fetch Error:", err);
      }
    };
    fetchCatalog();
  }, []);

  const handleSelectAnime = async (anime: any) => {
    setLoading(true);
    setError(null);
    try {
      // 1. Resolve Slugs for Dynamic Animes
      let realSlug = anime.slug;

      // Try resolving via search
      const searchRes = await fetch(`/api/search/${encodeURIComponent(anime.title)}`);
      const searchData = await searchRes.json();

      if (searchData.data && searchData.data.length > 0) {
        const match = searchData.data.find((r: any) =>
          r.title.toLowerCase().includes(anime.title.toLowerCase()) ||
          anime.title.toLowerCase().includes(r.title.toLowerCase())
        );
        if (match) realSlug = match.slug;
      }

      // 2. Resolve TMDB ID if missing
      let tmdbId = anime.tmdbId;
      if (!tmdbId) {
        tmdbId = await resolveTmdbId(anime.title);
      }

      // 3. Fetch details for seasons/episodes
      const res = await fetch(`/api/details/${realSlug}`);
      const data = await res.json();

      const fullAnime = {
        ...anime,
        slug: realSlug,
        tmdbId,
        seasons: data.ok && data.data?.seasons ? data.data.seasons : [],
        description: data.ok && data.data?.synopsis ? data.data.synopsis : anime.description,
        isGlobal: true
      };

      setSelectedAnime(fullAnime);
      setSeason('1');
      setEpisode('1');
      setView('watch');

      // 3. Fetch first episode
      const firstSeason = fullAnime.seasons[0];
      const firstEp = firstSeason?.episodes[0];

      if (firstEp) {
        fetchEpisode(firstEp.slug, '1', '1', 'sub', fullAnime);
      } else {
        fetchEpisode(anime.slug, '1', '1', 'sub', fullAnime);
      }
    } catch (err) {
      console.error("Selection error:", err);
      // Fallback simple select
      setSelectedAnime(anime);
      setSeason('1');
      setEpisode('1');
      setView('watch');
      fetchEpisode(anime.slug, '1', '1', 'sub', anime);
    } finally {
      setLoading(false);
    }
  };

  const proxyUrl = (url: string) => {
    if (!url) return 'https://placehold.co/400x600/1a1a1a/ffffff?text=Sugoi+Anime';

    // AniList and MyAnimeList images usually work fine directly if the user is on mobile/browser
    // In Brazil, these CDNs are usually not blocked by ISP, but sometimes by Referer.
    // We send directly to avoid unnecessary double-load via proxy unless needed.
    if (url.includes('anilist.co') || url.includes('myanimelist.net')) return url;

    // Use images.weserv.nl for reliable global image proxying for other sources
    return `https://images.weserv.nl/?url=${encodeURIComponent(url)}&w=400&output=webp`;
  };

  const getProxyUrl = (url: string) => proxyUrl(url);

  const isEmbed = (url: string) => {
    if (!url) return false;
    // Aggressive embed detection: if it's not a common video extension, treat as embed
    const videoExtensions = ['.mp4', '.mkv', '.webm', '.m3u8', '.mpd'];
    const lowerUrl = url.toLowerCase();
    if (videoExtensions.some(ext => lowerUrl.includes(ext) && !lowerUrl.includes('player'))) return false;
    return true; // Default to embed for security and reliability with external sources
  };

  const AnimeCard = ({ anime }: { anime: any }) => (
    <motion.div
      whileHover={{ y: -10, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => handleSelectAnime(anime)}
      className="group cursor-pointer relative"
    >
      <div className="aspect-[2/3] rounded-2xl overflow-hidden bg-[#1a1a1a] border border-white/10 relative shadow-2xl transition-all duration-300 group-hover:border-purple-500/50 group-hover:shadow-purple-500/20">
        <img
          src={proxyUrl(anime.image)}
          alt={anime.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
          onError={(e: any) => {
            e.target.src = 'https://placehold.co/400x600/1a1a1a/ffffff?text=Sugoi+Anime';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />

        <div className="absolute top-3 left-3 bg-purple-600 px-3 py-1 rounded-full text-[10px] font-black shadow-lg flex items-center gap-1 backdrop-blur-sm border border-white/20">
          <Star className="w-2.5 h-2.5 text-yellow-300 fill-yellow-300" />
          {anime.rating}
        </div>

        <div className="absolute bottom-4 left-4 right-4 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
          <h3 className="font-bold text-sm leading-tight drop-shadow-lg line-clamp-2">
            {anime.title}
          </h3>
          <p className="text-[10px] text-purple-300 mt-1 font-bold bg-purple-900/50 w-fit px-2 py-0.5 rounded backdrop-blur-sm uppercase tracking-tighter">
            {anime.category}
          </p>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden font-sans">
      <div className="main-gradient-bg" />

      {/* Modern Sidebar */}
      <aside className="w-20 lg:w-64 border-r border-white/5 bg-black/20 backdrop-blur-3xl flex flex-col z-50">
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
            <Tv className="w-6 h-6 text-white" />
          </div>
          <span className="hidden lg:block font-black text-xl tracking-tighter uppercase italic">
            YURE<span className="text-primary text-glow">ANIMES</span>
          </span>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          <SidebarItem icon={<HomeIcon />} label="Início" active={view === 'catalog'} onClick={() => setView('catalog')} />
          <SidebarItem icon={<Compass />} label="Explorar" />
          <SidebarItem icon={<History />} label="Histórico" />
          <SidebarItem icon={<Heart />} label="Favoritos" />
          <div className="pt-6 pb-2 px-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest hidden lg:block">Navegação</div>
          <SidebarItem icon={<LayoutGrid />} label="Gêneros" />
          <SidebarItem icon={<List />} label="Minha Lista" />
        </nav>

        <div className="p-4 border-t border-white/5 space-y-2">
          <SidebarItem icon={<Settings />} label="Ajustes" />
          <SidebarItem icon={<LogOut />} label="Sair" danger />
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto relative scrollbar-hide">
        {/* Top Navbar */}
        <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-md px-8 py-4 flex items-center justify-between">
          <div className="relative w-full max-w-md group">
            <input
              type="text"
              placeholder="Pesquisar por nome ou gênero..."
              className="premium-input pl-12"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-primary transition-colors" />
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-sm font-bold">Yure Alves</span>
              <span className="text-[10px] text-primary font-bold uppercase tracking-widest">Premium Plan</span>
            </div>
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-secondary p-[2px] cursor-pointer">
              <div className="w-full h-full rounded-full bg-background flex items-center justify-center overflow-hidden">
                <img src="https://ui-avatars.com/api/?name=Yure+Alves&background=random" alt="" />
              </div>
            </div>
          </div>
        </header>

        <AnimatePresence mode="wait">
          {view === 'catalog' ? (
            <motion.div
              key="catalog"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="pb-20"
            >
              {/* Netflix Style Hero */}
              <section className="relative h-[80vh] w-full overflow-hidden">
                {trendingAnimes.length > 0 && (
                  <>
                    <div className="absolute inset-0">
                      <img
                        src={proxyUrl(trendingAnimes[0].image)}
                        className="w-full h-full object-cover scale-105 blur-[2px] opacity-40"
                        alt=""
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
                      <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-transparent" />
                    </div>

                    <div className="absolute inset-0 flex flex-col justify-center px-8 lg:px-16 max-w-3xl z-10">
                      <div className="flex items-center gap-2 mb-4">
                        <span className="bg-red-600 text-white text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-tighter">N-series</span>
                        <span className="text-secondary font-black uppercase text-xs tracking-widest">Trending Now</span>
                      </div>
                      <h1 className="text-5xl lg:text-7xl font-black mb-4 tracking-tighter leading-[0.9] drop-shadow-2xl">
                        {trendingAnimes[0].title}
                      </h1>
                      <div className="flex items-center gap-4 mb-6 text-sm font-bold opacity-80">
                        <span className="text-green-400">98% Match</span>
                        <span>2024</span>
                        <span className="border border-white/20 px-2 rounded-sm text-[10px]">16+</span>
                        <span>{trendingAnimes[0].category}</span>
                      </div>
                      <p className="text-gray-300 text-lg mb-8 line-clamp-3 font-medium leading-relaxed drop-shadow-md">
                        {trendingAnimes[0].description}
                      </p>
                      <div className="flex items-center gap-3">
                        <button onClick={() => handleSelectAnime(trendingAnimes[0])} className="bg-white text-black px-8 py-3 rounded font-black flex items-center gap-2 hover:bg-white/90 transition-all text-lg active:scale-95 shadow-xl">
                          <Play className="w-6 h-6 fill-current" /> Assistir
                        </button>
                        <button onClick={() => handleSelectAnime(trendingAnimes[0])} className="bg-white/20 backdrop-blur-md text-white px-8 py-3 rounded font-black flex items-center gap-2 hover:bg-white/30 transition-all text-lg active:scale-95">
                          <Info className="w-6 h-6" /> Detalhes
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </section>

              {/* Rows */}
              <div className="px-8 lg:px-16 -mt-32 relative z-20 space-y-12">

                {/* Global Search Results from external API */}
                {searchQuery.length > 2 && globalResults.length > 0 && (
                  <div className="animate-in fade-in slide-in-from-top-4 duration-500">
                    <h2 className="text-2xl font-black tracking-tight mb-6 flex items-center gap-2">
                      <Search className="w-6 h-6 text-primary" /> Resultados para "{searchQuery}"
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 gap-4">
                      {globalResults.map((anime: any) => (
                        <AnimeCard key={anime.slug} anime={anime} />
                      ))}
                    </div>
                  </div>
                )}

                {/* Trending Row */}
                <section>
                  <h2 className="text-xl font-black tracking-tight mb-4 flex items-center gap-2">
                    Em Alta Hoje <ChevronRight className="w-4 h-4 text-primary" />
                  </h2>
                  <div className="flex gap-4 overflow-x-auto pb-6 scrollbar-hide">
                    {trendingAnimes.map((anime) => (
                      <div key={anime.slug} className="min-w-[180px] lg:min-w-[220px]">
                        <AnimeCard anime={anime} />
                      </div>
                    ))}
                  </div>
                </section>

                {/* Dubbed Row */}
                <section>
                  <h2 className="text-xl font-black tracking-tight mb-4 flex items-center gap-2">
                    Exclusividades Dubladas 🔥 <ChevronRight className="w-4 h-4 text-primary" />
                  </h2>
                  <div className="flex gap-4 overflow-x-auto pb-6 scrollbar-hide">
                    {dubbedAnimes.map((anime) => (
                      <div key={anime.slug} className="min-w-[180px] lg:min-w-[220px]">
                        <AnimeCard anime={anime} />
                      </div>
                    ))}
                  </div>
                </section>

                {/* Popular Row */}
                <section>
                  <h2 className="text-xl font-black tracking-tight mb-4 flex items-center gap-2">
                    Os Favoritos de Todos os Tempos <ChevronRight className="w-4 h-4 text-primary" />
                  </h2>
                  <div className="flex gap-4 overflow-x-auto pb-6 scrollbar-hide">
                    {popularAnimes.map((anime) => (
                      <div key={anime.slug} className="min-w-[180px] lg:min-w-[220px]">
                        <AnimeCard anime={anime} />
                      </div>
                    ))}
                  </div>
                </section>

              </div>
            </motion.div>
          ) : (
            <motion.div
              key="watch"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="p-8"
            >
              <div className="flex flex-col lg:flex-row gap-8">
                {/* Responsive Player Section */}
                <div className="flex-1 space-y-6">
                  <button
                    onClick={() => setView('catalog')}
                    className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-white transition-colors mb-2"
                  >
                    <ArrowLeft className="w-4 h-4" /> Voltar para o catálogo
                  </button>

                  <div className="glass-card overflow-hidden aspect-video relative bg-black">
                    {loading && (
                      <div className="absolute inset-0 z-20 bg-black/80 flex flex-col items-center justify-center gap-4">
                        <Loader2 className="w-12 h-12 text-primary animate-spin" />
                        <span className="text-sm font-bold tracking-widest uppercase animate-pulse">Sincronizando fonte...</span>
                      </div>
                    )}

                    {activeVideo ? (
                      isEmbed(activeVideo) ? (
                        <iframe
                          src={activeVideo}
                          className="w-full h-full border-0 shadow-2xl"
                          allowFullScreen
                          allow="autoplay; fullscreen"
                        />
                      ) : (
                        <video
                          key={activeVideo}
                          src={proxyUrl(activeVideo)}
                          controls
                          autoPlay
                          className="w-full h-full"
                          onError={(e) => {
                            const v = e.target as HTMLVideoElement;
                            if (!v.src.includes('proxy')) v.src = activeVideo;
                          }}
                        />
                      )
                    ) : !loading && (
                      <div className="flex flex-col items-center justify-center h-full text-gray-600 gap-4">
                        <Tv className="w-16 h-16 opacity-30" />
                        <span className="font-bold">Nenhum episódio encontrado</span>
                        <span className="text-xs text-gray-500 mt-2">
                          {audio === 'dub' ? 'A versão dublada pode não estar disponível.' : 'Tente trocar de servidor ou temporada.'}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 pb-6 border-b border-white/5">
                    <div className="space-y-2">
                      <h2 className="text-4xl font-black tracking-tight">{selectedAnime?.title}</h2>
                      <div className="flex items-center gap-3 text-xs font-bold text-gray-400">
                        <span className="flex items-center gap-1 text-accent"><Star className="w-3 h-3 fill-current" /> {selectedAnime?.rating}</span>
                        <span className="w-1 h-1 bg-gray-600 rounded-full" />
                        <span className="text-primary uppercase tracking-widest">{selectedAnime?.category}</span>
                        <span className="w-1 h-1 bg-gray-600 rounded-full" />
                        {selectedAnime?.type === 'serie' && <span>T{season} : E{episode}</span>}
                        <span className="w-1 h-1 bg-gray-600 rounded-full" />
                        <span className="uppercase text-white">{audio === 'sub' ? 'Legendado' : 'Dublado'}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <button className="premium-button bg-white/5 hover:bg-white/10 p-3"><ExternalLink className="w-5 h-5" /></button>
                      {selectedAnime?.type === 'serie' && (
                        <button onClick={() => {
                          const nextEp = (parseInt(episode) + 1).toString();
                          setEpisode(nextEp);
                          fetchEpisode(undefined, nextEp);
                        }} className="premium-button-primary">Próximo Episódio</button>
                      )}
                    </div>
                  </div>

                  <p className="text-gray-400 leading-relaxed max-w-4xl italic opacity-80">
                    "{selectedAnime?.description}"
                  </p>
                </div>

                {/* Right Panel: Controls & Server Select */}
                <div className="w-full lg:w-80 space-y-6">
                  <div className="glass-card p-6 space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="font-black text-lg">Controles</h3>
                      <Settings className="w-4 h-4 text-gray-500" />
                    </div>

                    <div className="flex bg-white/5 p-1 rounded-xl mb-6">
                      <button
                        onClick={() => { setAudio('sub'); fetchEpisode(undefined, undefined, undefined, 'sub'); }}
                        className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${audio === 'sub' ? 'bg-primary text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                      >
                        Legendado
                      </button>
                      <button
                        onClick={() => { setAudio('dub'); fetchEpisode(undefined, undefined, undefined, 'dub'); }}
                        className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${audio === 'dub' ? 'bg-primary text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                      >
                        Dublado
                      </button>
                    </div>

                    {selectedAnime?.type === 'serie' && (
                      <div className="space-y-4">
                        <div>
                          <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-2">Temporada</label>
                          <select
                            value={season}
                            onChange={(e) => {
                              setSeason(e.target.value);
                              fetchEpisode(undefined, episode, e.target.value);
                            }}
                            className="premium-input bg-white/5"
                          >
                            {[1, 2, 3, 4, 5].map(v => <option key={v} value={v}>Temporada {v}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-2">Episódio Atual</label>
                          <div className="flex gap-2">
                            <input
                              type="number"
                              min="1"
                              value={episode}
                              onChange={(e) => setEpisode(e.target.value)}
                              className="premium-input"
                            />
                            <button onClick={() => fetchEpisode()} className="premium-button bg-primary p-3"><Play className="w-5 h-5 fill-current" /></button>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="space-y-3 pt-6 border-t border-white/5">
                      <span className="text-[10px] font-black text-primary uppercase tracking-widest">Servidores Disponíveis</span>
                      <div className="space-y-2">
                        {results.length > 0 ? results.map((res, i) => (
                          <div key={i} className="flex gap-2">
                            <button
                              onClick={() => setActiveVideo(res.episodes[0].episode)}
                              className={`flex-1 p-3 rounded-xl border flex items-center justify-between text-xs font-bold transition-all ${activeVideo === res.episodes[0].episode
                                ? 'bg-primary/20 border-primary text-primary shadow-lg shadow-primary/10'
                                : 'bg-white/5 border-transparent hover:border-white/20'
                                }`}
                            >
                              <span className="flex items-center gap-2">
                                <span className={`w-2 h-2 rounded-full ${audio === 'dub' ? 'bg-blue-500' : 'bg-yellow-500'} animate-pulse`}></span>
                                {res.name}
                                <span className="opacity-50 text-[10px] uppercase ml-1">
                                  ({audio === 'dub' ? 'Dublado' : 'Legendado'})
                                </span>
                              </span>

                            </button>
                            <a href={res.episodes[0].episode} target="_blank" className="p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-colors"><ExternalLink className="w-4 h-4 text-gray-400" /></a>
                          </div>
                        )) : (
                          <div className="text-center py-6 text-[11px] text-gray-500 border border-dashed border-white/10 rounded-xl">
                            {loading ? 'Buscando fontes...' : 'Nenhum servidor encontrado.'}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Recommendations */}
                  <div className="space-y-4">
                    <h3 className="font-black text-sm uppercase tracking-widest text-gray-500 px-2">Sugestões Rápidas</h3>
                    <div className="space-y-3">
                      {animeList.slice(2, 5).map(anime => (
                        <div
                          key={anime.slug}
                          className="flex gap-4 p-2 rounded-2xl hover:bg-white/5 transition-all cursor-pointer group"
                          onClick={() => handleSelectAnime(anime)}
                        >
                          <div className="w-16 h-20 rounded-xl overflow-hidden shrink-0">
                            <img src={proxyUrl(anime.image)} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="" />
                          </div>
                          <div className="flex flex-col justify-center">
                            <h5 className="font-bold text-sm group-hover:text-primary transition-colors line-clamp-1">{anime.title}</h5>
                            <span className="text-[10px] text-gray-500 uppercase font-black mt-1">{anime.category}</span>
                            <div className="flex items-center gap-1 text-[10px] text-accent mt-1">
                              <Star className="w-3 h-3 fill-current" /> {anime.rating}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating Error Notification */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed bottom-8 right-8 z-[100] glass-card bg-red-500/10 border-red-500/20 p-5 flex items-start gap-4 max-w-sm"
            >
              <div className="p-2 bg-red-500 rounded-lg"><AlertCircle className="w-5 h-5 text-white" /></div>
              <div>
                <h4 className="font-bold text-sm text-red-200">Encontramos um problema</h4>
                <p className="text-xs text-red-100/60 mt-1">{error}</p>
                <button onClick={() => setError(null)} className="mt-3 text-[10px] font-black uppercase text-red-400 hover:text-red-300">Entendi</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

function SidebarItem({ icon, label, active = false, danger = false, onClick }: any) {
  return (
    <div
      onClick={onClick}
      className={`
        flex items-center gap-4 px-4 py-3 rounded-2xl cursor-pointer transition-all duration-300 group
        ${active ? 'bg-primary/10 text-primary' : 'text-gray-500 hover:bg-white/5 hover:text-white'}
        ${danger ? 'hover:bg-red-500/10 hover:text-red-500' : ''}
      `}
    >
      <div className={`w-5 h-5 ${active ? 'text-primary' : 'group-hover:scale-110 transition-transform'}`}>
        {icon}
      </div>
      <span className="hidden lg:block font-bold text-sm tracking-tight">{label}</span>
      {active && <div className="hidden lg:block absolute left-0 w-1 h-6 bg-primary rounded-r-full shadow-[0_0_10px_var(--primary)]" />}
    </div>
  );
}
