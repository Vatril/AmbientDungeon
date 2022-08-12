import { GenreButtons } from "./components/GenreButtons"
import { PlayerStatus } from "./components/PlayerStatus"
import style from "./App.module.css"
import { SpecialsButtons } from "./components/SpecialsButtons"

export const App = () => {
    return (
        <>
            <div className={style.header}>
                <h1>Ambient Dungeon</h1>
                <PlayerStatus />
            </div>
            <div className={style.playListBox}>
                <GenreButtons />
                <SpecialsButtons />
            </div>
        </>
    )
}
