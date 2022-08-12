import style from "./Loader.module.css"

export const Loader = () => (
    <div className={style.wrapper}>
        <div className={style.ldsRing}>
            {[...Array(4)].map((_, i) => (
                <div key={i} />
            ))}
        </div>
    </div>
)
