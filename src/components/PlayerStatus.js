import {gql, useMutation, useQuery} from "@apollo/client"
import {useEffect} from "react"
import style from "./PlayerStatus.module.css"
import {Play, Pause, PlaySkipForward} from "react-ionicons"

const GET_STATUS = gql`
    query getStatus {
        status {
            channel
            genre
            isPlaying
            song
        }
    }
`

const PAUSE = gql`
    mutation pause {
        pause
    }
`

const UNPAUSE = gql`
    mutation unpause {
        unpause
    }
`

const SKIP = gql`
    mutation skip {
        skip
    }
`

export const PlayerStatus = () => {
    const {data, loading, startPolling} = useQuery(GET_STATUS)

    const [pause] = useMutation(PAUSE)
    const [unpause] = useMutation(UNPAUSE)
    const [skip] = useMutation(SKIP)

    useEffect(() => {
        startPolling(1000)
    }, [])

    if (loading) {
        return <h2/>
    } else if (data?.status?.channel) {
        return (
            <div className={style.playBox}>
                <div className={style.statusBox}>
                    <p>Connected to:</p>
                    <p> {data?.status?.channel}</p>

                    <p>Playlist:</p>
                    <p> {data?.status?.genre?.replaceAll("_", " ") || "-"}</p>

                    <p>Playing:</p>
                    <p> {data?.status?.song || "-"}</p>

                </div>
                {data?.status?.song ? <div className={style.controlBox}>
                    {data?.status?.isPlaying ? <Pause color="var(--white)" onClick={() => pause()}/> :
                        <Play color="var(--white)" onClick={() => unpause()}/>}
                    <PlaySkipForward color="var(--white)" onClick={() => skip()}/>
                </div> : null}
            </div>
        )
    } else {
        return (
            <h2 className={style.joinMessage}>
                Enter a voice channel and type /join to start
            </h2>
        )
    }
}
