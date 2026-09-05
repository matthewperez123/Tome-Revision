"use client"

import { useEffect, useRef, useState } from "react"
import styles from "./VirgilCharacter.module.css"

export type VirgilMood = "idle" | "wave" | "think" | "celebrate" | "read"

/** Original Virgil artwork; web animations until an export-enabled Rive runtime asset is available. */
export function VirgilCharacter({ className = "", mood = "idle", paused = false }: {
  className?: string
  mood?: VirgilMood
  paused?: boolean
}) {
  const container = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(true)
  const [pageVisible, setPageVisible] = useState(true)
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting))
    if (container.current) observer.observe(container.current)
    const updateVisibility = () => setPageVisible(!document.hidden)
    document.addEventListener("visibilitychange", updateVisibility)
    updateVisibility()
    return () => {
      observer.disconnect()
      document.removeEventListener("visibilitychange", updateVisibility)
    }
  }, [])
  return (
    <div ref={container} data-mood={mood} data-paused={paused || !visible || !pageVisible} className={`${styles.character} ${className}`}>
<svg viewBox="0 0 512 512" role="img" aria-label="Virgil, Tome’s blue-cloaked scholar holding a scroll" className={styles.artwork}>
<g data-part="Shadow"><ellipse cx="256" cy="448" rx="92" ry="12" fill="#E8EBF5"/></g>
<g data-part="Virgil" stroke="#252B70" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
 <g data-part="CapeBack"><path d="M176 274 C144 330 93 341 108 382 C94 430 164 431 214 418 C322 431 399 411 380 353 Q375 299 323 272Z" fill="#3159BE"/></g>
 <g data-part="FootLeft"><ellipse cx="225" cy="402" rx="20" ry="30" fill="#F4E5CE"/><ellipse cx="225" cy="397" rx="16" ry="25" fill="#FFFAEF" stroke="none"/></g>
 <g data-part="FootRight"><ellipse cx="284" cy="402" rx="20" ry="30" fill="#F4E5CE"/><ellipse cx="284" cy="397" rx="16" ry="25" fill="#FFFAEF" stroke="none"/></g>
 <g data-part="Body"><path d="M222 267 C184 296 170 363 193 385 C224 412 300 406 330 374 Q343 330 296 271Z" fill="#F4E5CE"/><path d="M242 281 Q216 351 207 372 Q262 396 311 365 Q285 323 277 285Z" fill="#FFFAEF" stroke="none"/></g>
 <g data-part="CapeLeft"><path d="M274 278 C231 285 188 283 167 299 C138 326 77 324 79 350 C88 380 133 364 148 391 C174 423 257 347 274 278Z" fill="#568CF0"/><path d="M79 350 Q112 333 148 391 C108 386 81 376 79 350Z" fill="#3159BE" stroke="none"/><path d="M160 347 Q219 337 262 293" fill="none" stroke="#3159BE" strokeWidth="3"/></g>
 <g data-part="CapeRight"><path d="M280 279 Q345 282 372 326 Q389 352 373 382 Q320 343 280 279Z" fill="#568CF0"/></g>
 <g data-part="HandLeft"><path d="M159 309 Q122 313 119 290 Q130 285 166 300Z" fill="#3159BE"/><ellipse cx="119" cy="288" rx="18" ry="19" fill="#FFFAEF"/></g>
 <g data-part="Head">
  <path data-part="Hood" d="M128 266 C94 252 103 213 123 178 C153 124 220 79 265 79 C332 77 380 151 391 216 C406 276 333 292 276 289 C213 291 161 286 128 266Z" fill="#568CF0"/>
  <path d="M120 198 C117 258 193 283 278 279 Q357 281 384 249 C361 292 165 308 128 266 Q103 250 120 198Z" fill="#3159BE" stroke="none"/>
  <path d="M150 238 C136 195 187 105 256 98 C329 91 367 157 368 219 C371 267 322 276 275 275 C212 277 163 264 150 238Z" fill="#3159BE"/>
  <path d="M156 235 C145 185 194 115 256 109 C317 99 357 158 359 215 C364 255 321 269 276 269 C215 272 168 259 156 235Z" fill="#F4E5CE" stroke="none"/>
  <path data-part="Face" d="M163 225 C153 180 198 117 256 111 C313 103 350 158 350 211 C352 251 316 267 274 267 C216 269 172 252 163 225Z" fill="#FFFAEF" stroke="none"/>
  <g data-part="Eyes" fill="#252B70" stroke="none"><ellipse data-part="EyeLeft" cx="220" cy="193" rx="9" ry="14"/><ellipse data-part="EyeRight" cx="306" cy="193" rx="9" ry="14"/></g>
  <g data-part="Mouth"><path d="M255 214 Q264 225 273 214" fill="none"/></g>
<g stroke="none" data-pose="04_Wink"><path d="M163 225 C153 180 198 117 256 111 C313 103 350 158 350 211 C352 251 316 267 274 267 C216 269 172 252 163 225Z" fill="#FFFAEF" stroke="none" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/><ellipse cx="220" cy="192" rx="9" ry="14" fill="#252B70"/><path d="M294 193 Q306 180 318 193" fill="none" stroke="#252B70" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/><path d="M252 215 Q264 230 278 213" fill="none" stroke="#252B70" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/><ellipse cx="203" cy="214" rx="11" ry="5" fill="#F4C4AD"/><ellipse cx="322" cy="214" rx="11" ry="5" fill="#F4C4AD"/></g>
<g stroke="none" data-pose="06_Think"><path d="M163 225 C153 180 198 117 256 111 C313 103 350 158 350 211 C352 251 316 267 274 267 C216 269 172 252 163 225Z" fill="#FFFAEF" stroke="none" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/><ellipse cx="228" cy="194" rx="9" ry="12" fill="#252B70"/><ellipse cx="314" cy="194" rx="9" ry="12" fill="#252B70"/><path d="M207 173 L233 169 M294 161 Q307 153 320 162" fill="none" stroke="#252B70" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/><path d="M255 220 Q269 214 281 220" fill="none" stroke="#252B70" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/></g>
<g stroke="none" data-pose="03_Joy"><path d="M163 225 C153 180 198 117 256 111 C313 103 350 158 350 211 C352 251 316 267 274 267 C216 269 172 252 163 225Z" fill="#FFFAEF" stroke="none" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/><path d="M207 195 Q220 177 233 195 M293 195 Q306 177 319 195" fill="none" stroke="#252B70" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/><path d="M246 211 Q264 219 282 210 Q282 238 266 239 Q250 238 246 211Z" fill="#252B70" stroke="none" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/><path d="M254 232 Q268 223 277 232 Q271 240 261 237Z" fill="#E2684A" stroke="none" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/><ellipse cx="203" cy="214" rx="11" ry="5" fill="#F4C4AD"/><ellipse cx="322" cy="214" rx="11" ry="5" fill="#F4C4AD"/></g>
<g stroke="none" data-pose="11_Read"><path d="M163 225 C153 180 198 117 256 111 C313 103 350 158 350 211 C352 251 316 267 274 267 C216 269 172 252 163 225Z" fill="#FFFAEF" stroke="none" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/><ellipse cx="216" cy="200" rx="9" ry="10" fill="#252B70"/><ellipse cx="302" cy="200" rx="9" ry="10" fill="#252B70"/><path d="M256 221 Q265 227 273 220" fill="none" stroke="#252B70" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/></g>
 </g>
 <g data-part="Clasp"><ellipse cx="279" cy="284" rx="18" ry="19" fill="#CF9C36"/><ellipse cx="278" cy="281" rx="15" ry="16" fill="#FFD34E" stroke="none"/><ellipse cx="272" cy="274" rx="4" ry="3" fill="#FFEC9C" stroke="none"/></g>
 <g data-part="ScrollHand"><path d="M325 322 L354 247 Q367 236 386 251 L355 336 Q335 346 325 322Z" fill="#FFEB9E"/><path d="M333 325 L358 261 L368 264 L344 332Z" fill="#FFF5C1" stroke="none"/><ellipse cx="370" cy="252" rx="18" ry="10" fill="#FFD34E"/><ellipse cx="370" cy="252" rx="9" ry="4" fill="#AB782B" stroke="none"/><ellipse cx="366" cy="303" rx="22" ry="23" fill="#F4E5CE"/><ellipse cx="369" cy="300" rx="18" ry="18" fill="#FFFAEF" stroke="none"/></g>
</g>
</svg>
    </div>
  )
}
