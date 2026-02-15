
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
    mediaId: 151807, // Solo Leveling
    title: "Solo Leveling",
    tmdbId: "214691",
    slug: "solo-leveling",
    dubSlug: "solo-leveling-dublado",
    image: "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx151807-m1gX3i8LHLTU.jpg",
    category: "Ação",
    rating: "4.9",
    status: "Popular",
    description: "O caçador mais fraco da humanidade recebe uma chance única de subir de nível sem limites.",
    dubbedAvailable: true,
    type: "serie"
  },
  {
    mediaId: 1735, // Naruto Shippuden
    title: "Naruto Shippuden",
    tmdbId: "31910",
    slug: "naruto-shippuden",
    dubSlug: "naruto-shippuden-dublado",
    image: "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx1735-4l90z37qP2ks.jpg",
    category: "Shonen",
    rating: "4.8",
    status: "Clássico",
    description: "A jornada de um jovem ninja em busca de reconhecimento e do título de Hokage.",
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
    mediaId: 97940, // Black Clover
    title: "Black Clover",
    tmdbId: "73223",
    slug: "black-clover",
    dubSlug: "black-clover-dublado",
    image: "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx97940-99axS9.jpg",
    category: "Shonen",
    rating: "4.7",
    status: "Popular",
    description: "Asta e Yuno competem para se tornar o Rei Mago em um mundo de magia.",
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

  const fetchEpisode = async (animeSlug?: string, epNum?: string, seaNum?: string, audioType?: 'sub' | 'dub') => {
    let baseSlug = animeSlug || selectedAnime?.slug;
    if (baseSlug?.endsWith('-dublado')) baseSlug = baseSlug.replace('-dublado', '');

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
      const explicitDubSlug = selectedAnime?.dubSlug || animeList.find((a: any) => a.slug === baseSlug)?.dubSlug;
      if (explicitDubSlug) slugsToTry.push(explicitDubSlug);

      slugsToTry.push(`${baseSlug}-dublado`);
      slugsToTry.push(`${baseSlug}-dub`);
    } else {
      slugsToTry.push(baseSlug);
    }

    try {
      let foundData = null;
      for (const slug of slugsToTry) {
        try {
          const res = await fetch(`/api/episode/${slug}/${currentSea}/${currentEp}`);
          const data = await res.json();
          if (res.status === 200 && !data.error && data.data && data.data.some((r: any) => r.episodes[0] && !r.episodes[0].error)) {
            foundData = data.data;
            break;
          }
        } catch (e) {
          // Continue
        }
      }

      // Servidores Estáveis de Backup (Sempre disponíveis para o usuário)
      const currentAnime = selectedAnime || animeList.find((a: any) => a.slug === baseSlug);
      const tmdbId = currentAnime?.tmdbId;
      const isMovie = currentAnime?.type === 'movie';

      const cloudFallbacks = tmdbId ? [
        {
          name: 'VIP ULTRA 3 [BRASIL]',
          slug: 'stable-1',
          has_ads: true,
          is_embed: true,
          episodes: [{
            error: false,
            episode: isMovie
              ? `https://autoembed.to/movie/tmdb/${tmdbId}?server=10`
              : `https://autoembed.to/tv/tmdb/${tmdbId}-${currentSea}-${currentEp}?server=10`
          }]
        },
        {
          name: 'VIP ULTRA 4 [BRASIL]',
          slug: 'stable-2',
          has_ads: true,
          is_embed: true,
          episodes: [{
            error: false,
            episode: isMovie
              ? `https://embed.plus/movie/${tmdbId}`
              : `https://embed.plus/tv/${tmdbId}/${currentSea}/${currentEp}`
          }]
        },
        {
          name: 'Global Play (Multilingue)',
          slug: 'stable-3',
          has_ads: true,
          is_embed: true,
          episodes: [{
            error: false,
            episode: isMovie
              ? `https://vidsrc.to/embed/movie/${tmdbId}`
              : `https://vidsrc.to/embed/tv/${tmdbId}/${currentSea}/${currentEp}`
          }]
        }
      ] : [];

      if (foundData) {
        setResults([...foundData, ...cloudFallbacks]);
        const first = foundData.find((r: any) => r.episodes[0] && !r.episodes[0].error);
        if (first) setActiveVideo(first.episodes[0].episode);
        else if (cloudFallbacks.length > 0) setActiveVideo(cloudFallbacks[0].episodes[0].episode);
      } else {
        if (cloudFallbacks.length > 0) {
          setResults(cloudFallbacks);
          setActiveVideo(cloudFallbacks[0].episodes[0].episode);
        } else {
          setError(currentAudio === 'dub' ? 'Versão dublada não encontrada.' : 'Episódio não encontrado.');
          setResults([]);
        }
      }
    } catch (err) {
      setError('Erro de conexão.');
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAnime = async (anime: any) => {
    // Se o anime já tem tmdbId ou slug interno, vai pro fluxo normal
    if (anime.mediaId || anime.tmdbId) {
      setSelectedAnime(anime);
      setSeason('1');
      setEpisode('1');
      setAudio('sub');
      setView('watch');
      fetchEpisode(anime.slug, '1', '1', 'sub');
    } else {
      // Anime vindo da busca global (Animes Online CC)
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/details/${anime.slug}`);
        const data = await res.json();
        if (!data.error) {
          const fullAnime = {
            ...anime,
            seasons: data.data.seasons,
            description: data.data.synopsis,
            isGlobal: true
          };
          setSelectedAnime(fullAnime);
          setSeason('1');
          setEpisode('1');
          setView('watch');

          // Pegar o primeiro episódio real do primeiro item da season
          const firstSeason = data.data.seasons[0];
          const firstEp = firstSeason.episodes[0];
          fetchEpisode(firstEp.slug, '1', '1', 'sub');
        } else {
          setError("Não foi possível carregar os detalhes deste anime.");
        }
      } catch (err) {
        setError("Erro ao conectar com o servidor de busca.");
      } finally {
        setLoading(false);
      }
    }
  };

  const proxyUrl = (url: string) => {
    if (!url) return '';
    if (url.startsWith('/')) {
      return `/api/proxy?url=${encodeURIComponent('https://animesonlinecc.to' + url)}`;
    }
    if (url.includes('ui-avatars.com')) return url;
    // Proxy AniList too as it might be blocked for some users
    return `/api/proxy?url=${encodeURIComponent(url)}`;
  };

  const getProxyUrl = (url: string) => proxyUrl(url);

  const isEmbed = (url: string) => {
    if (!url) return false;
    const embeds = ['iframe', 'animesonline', 'blogger.com', 'google.com/video.g', 'youtube.com', 'player', 'vidmoly', 'autom', 'vidsrc', 'superemba', 'embed', 'warezcdn', 'superflix', 'autoembed', 'multiembed', 'smashy'];
    return embeds.some(e => url.includes(e));
  };

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
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-8 space-y-12"
            >
              <section className="relative h-[400px] rounded-[40px] overflow-hidden group">
                <div className="absolute inset-0">
                  <img src={proxyUrl(animeList[0].image)} className="w-full h-full object-cover brightness-50" alt="" />
                  <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent" />
                </div>
                <div className="absolute inset-0 p-12 flex flex-col justify-center max-w-2xl">
                  <div className="flex items-center gap-2 text-primary font-bold mb-4">
                    <Star className="w-5 h-5 fill-current" />
                    <span className="tracking-widest uppercase text-xs">Anime em Destaque</span>
                  </div>
                  <h1 className="text-6xl font-black mb-6 tracking-tight">{animeList[0].title}</h1>
                  <p className="text-gray-300 text-lg mb-8 leading-relaxed opacity-90">
                    Acompanhe a jornada épica em busca do tesouro supremo e torne-se o Rei dos Piratas.
                  </p>
                  <div className="flex items-center gap-4">
                    <button onClick={() => handleSelectAnime(animeList[0])} className="premium-button-primary flex items-center gap-2">
                      <Play className="w-5 h-5 fill-current" /> Começar Agora
                    </button>
                    <button className="premium-button bg-white/10 hover:bg-white/20">Saiba Mais</button>
                  </div>
                </div>
              </section>

              {/* Global Search Results from external API */}
              {searchQuery.length > 2 && globalResults.length > 0 && (
                <div className="mb-12 animate-in fade-in slide-in-from-top-4 duration-500">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-1 h-8 bg-primary rounded-full" />
                    <h2 className="text-2xl font-black tracking-tight flex items-center gap-2">
                      Resultados Globais <span className="text-sm font-normal text-gray-500">({globalResults.length} encontrados)</span>
                    </h2>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                    {globalResults.map((anime) => (
                      <div
                        key={anime.slug}
                        onClick={() => handleSelectAnime(anime)}
                        className="anime-card group cursor-pointer"
                      >
                        <div className="relative aspect-[2/3] rounded-2xl overflow-hidden mb-3">
                          <img
                            src={proxyUrl(anime.image)}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            alt={anime.title}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                          <div className="absolute top-2 right-2 bg-primary/90 text-black text-[10px] font-black px-2 py-1 rounded-md backdrop-blur-md">
                            {anime.rating}
                          </div>
                        </div>
                        <h3 className="font-bold text-sm line-clamp-1 group-hover:text-primary transition-colors">{anime.title}</h3>
                        <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wider mt-1">{anime.category}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <section>
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-black tracking-tight">Recém Adicionados</h2>
                  <div className="flex items-center gap-2">
                    <div className="flex bg-white/5 rounded-lg p-1">
                      <button className="p-2 text-primary"><LayoutGrid className="w-4 h-4" /></button>
                      <button className="p-2 text-gray-500"><List className="w-4 h-4" /></button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xxl:grid-cols-5 gap-8">
                  {filteredCatalog.map((anime) => (
                    <div
                      key={`${anime.slug}-${anime.mediaId}`}
                      className="anime-card-v2 group aspect-[2/3]"
                      onClick={() => handleSelectAnime(anime)}
                    >
                      <img src={proxyUrl(anime.image)} alt="" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
                      <div className="absolute top-4 left-4">
                        <span className="status-badge bg-primary text-white shadow-lg">{anime.status}</span>
                      </div>
                      <div className="absolute bottom-4 left-4 right-4">
                        <h4 className="font-bold text-lg mb-1 leading-tight group-hover:text-primary transition-colors">{anime.title}</h4>
                        <div className="flex items-center justify-between text-[11px] text-gray-400">
                          <span>{anime.category}</span>
                          <span className="flex items-center gap-1"><Star className="w-3 h-3 text-accent fill-current" /> {anime.rating}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
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
                          sandbox="allow-forms allow-pointer-lock allow-same-origin allow-scripts"
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
