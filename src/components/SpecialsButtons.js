import { gql, useMutation, useQuery } from "@apollo/client"
import { Loader } from "../util/Loader"
import style from "./ButtonList.module.css"

const GET_SPECIALS = gql`
    query getSpecials {
        specials
    }
`

const PLAY_SPECIAL = gql`
    mutation playSpecial($song: String!) {
        playSpecial(song: $song)
    }
`

export const SpecialsButtons = () => {
    const { data, loading } = useQuery(GET_SPECIALS)
    const [play] = useMutation(PLAY_SPECIAL)

    if (loading) {
        return <Loader />
    } else {
        return (
            <div>
                <h2>Specials</h2>
                <div className={style.buttonList}>
                    {data?.specials?.map((g, i) => (
                        <button
                            key={i}
                            onClick={() => play({ variables: { song: g } })}
                        >
                            {g.replace("_", " ")})
                        </button>
                    ))}
                </div>
            </div>
        )
    }
}
