import { GetStaticProps } from 'next';
import Image from 'next/image';
import { format, parseISO } from 'date-fns'
import ptBR from 'date-fns/locale/pt-BR'
import { api } from '../services/api';
import { convertDurationToTimeString } from '../utils/convertDurationToTimeString';

import styles from './home.module.scss';

type File = {
    url: string;
    type: string;
    duration: number;
}

type Episodes = { 
        id: string;
        title: string;
        members: string;
        published_at: string;
        publishedAt: string;
        durationAsString: string;
        thumbnail: string;
        description: string;
        url: string;
        type: string;
        duration: number;
        file: File;
}

type HomeProps = {
    //episodes: Episodes[]; //ou Array<Episodes>
    latesEpisodes: Episodes[];
    allEpisodes: Episodes[];
}

export default function Home( { latesEpisodes, allEpisodes }: HomeProps ) {
    return (
        <div className={styles.homepage}>

           <section className={styles.latesEpisodes}>
                <h2>Últimos Lançamentos</h2>

                <ul>
                    {latesEpisodes.map(episode =>{
                        return (
                         <li key={episode.id}>
                             <Image 
                                width={192} 
                                height={192} 
                                src={episode.thumbnail} 
                                alt={episode.title}
                                objectFit="cover"
                            />

                             <div className={styles.episodeDetails}>
                                 <a href="">{episode.title}</a>
                                 <p>{episode.members}</p>
                                 <span>{episode.publishedAt}</span>
                                 <span>{episode.durationAsString}</span>
                             </div>

                             <button type="button">
                                 <img src="/play-green.svg" alt="Tocar episódio"/>
                             </button>
                         </li>
                        )
                    })}
                </ul>

           </section>

           <section className={styles.allEpisodes}>
               
           </section>

        </div>
    )
}
/*
return (
        <div>
            <h1>Index</h1>
            <p>{JSON.stringify(props.episodes)}</p>
        </div>
    )
*/

//Usando o fecth
/*
export const getStaticProps: GetStaticProps = async () => {
    const response = await fetch('http://localhost:3333/episodes?_limit=12&_sort=published_at&_order=desc')
    const data = await response.json()

    return {
        props: {
            episodes: data,
        },
        revalidate: 60 * 60 * 8,
    }
}
*/

//Usando o axion ==> yarn add axios
/*
export const getStaticProps: GetStaticProps = async () => {
    const response = await api.get('episodes?_limit=12&_sort=published_at&_order=desc')
    const data = await response.data()
    return {
        props: {
            episodes: data,
        },
        revalidate: 60 * 60 * 8,
    }
}
*/
//Fatorando com axios
export const getStaticProps: GetStaticProps = async () => {
    const { data } = await api.get('episodes', {
        params: {
            _limit: 12,
            _sort: 'published_at',
            _order: 'desc'
        }
    })

    const episodes = data.map(episode => {
        return {
            id: episode.id,
            title: episode.title,
            members: episode.members,
            publishedAt: format(parseISO(episode.published_at), 'd MM yy', { locale: ptBR} ),
            thumbnail: episode.thumbnail,
            description: episode.description,
            url: episode.file.url,
            duration: Number(episode.file.duration),
            durationAsString: convertDurationToTimeString(Number(episode.file.duration)),
            type: episode.file.type
        };
    });

    const latesEpisodes = episodes.slice(0, 2);
    const allEpisodes = episodes.slice(2, episodes.length);
    
    return {
        props: {
            latesEpisodes,
            allEpisodes
        },
        revalidate: 60 * 60 * 8,
    }
}
