import { GetStaticProps } from 'next';
import { format, parseISO } from 'date-fns'
import ptBR from 'date-fns/locale/pt-BR'
import { api } from '../services/api';

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
        thumbnail: string;
        description: string;
        file: File;
}

type HomeProps = {
    episodes: Episodes; //ou Array<Episodes>
}

export default function Home(props: HomeProps) {
    return (
        <div>
            <h1>Index</h1>

            <p>{JSON.stringify(props.episodes)}</p>
        </div>
    )
}

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
            type: episode.file.type
        };
    });
    
    return {
        props: {
            episodes: data,
        },
        revalidate: 60 * 60 * 8,
    }
}
