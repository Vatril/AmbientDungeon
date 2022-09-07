import { gql, useMutation, useQuery } from "@apollo/client"
import { Loader } from "../util/Loader"
import style from "./ButtonList.module.css"

const GET_GENRES = gql`
    query getGenres {
        genres {
            amount
            name
        }
        specials
    }
`

const PLAY_GENRE = gql`
    mutation play($genre: String!) {
        play(genre: $genre)
    }
`

export const GenreButtons = () => {
    const { data, loading } = useQuery(GET_GENRES)
    const [play] = useMutation(PLAY_GENRE)

    if (loading) {
        return <Loader />
    } else {
        return (
            <div>
                <h2>Playlists</h2>
                <div className={style.buttonList}>
                    {data?.genres
                        .filter((g) => g.amount)
                        .map((g, i) => (
                            <button
                                key={i}
                                onClick={() =>
                                    play({ variables: { genre: g.name } })
                                }
                            >
                                {g.name.replaceAll("_", " ")} ({g.amount})
                            </button>
                        ))}
                </div>
            </div>
        )
    }
}
