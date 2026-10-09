import masterBedroom from "@/imports/interior-master-bedroom.jpeg"
import bedroomBlush from "@/imports/interior-bedroom-blush.jpeg"
import kitchenGloss from "@/imports/interior-kitchen-gloss.jpeg"
import kitchenLShaped from "@/imports/interior-kitchen-l-shaped.jpeg"
import livingTvMarble from "@/imports/interior-living-tv-marble.jpeg"
import livingTvWalnut from "@/imports/interior-living-tv-walnut.jpeg"
import poojaRoom from "@/imports/interior-pooja-room.jpeg"
import livingKitchenWarm from "@/imports/interior-living-kitchen-warm.jpg"
import livingKitchenWhite from "@/imports/interior-living-kitchen-white.jpg"

export const ROOM_TABS = ["Living Room", "Bedroom", "Kitchen", "Pooja Room"] as const
export type Room = (typeof ROOM_TABS)[number]

export type InteriorProject = {
  id: string
  title: string
  room: Room
  img: string
  /** Short line used on the card. */
  summary: string
  /** Long-form copy shown when the project is opened. */
  detail: string
  /** Key material and finish callouts — rendered as spec chips. */
  materials: string[]
  /** Itemised scope of work delivered for this room. */
  scope: string[]
}

export const INTERIOR_PROJECTS: InteriorProject[] = [
  {
    id: "living-kitchen-warm",
    title: "Warm Timber Open-Plan Living & Kitchen",
    room: "Living Room",
    img: livingKitchenWarm,
    summary: "Fluted timber media wall with LED underglow, open shelving and a tangerine-and-cream kitchen.",
    detail:
      "An open-plan living and kitchen space tied together by warm timber. A fluted wood feature wall frames the television, with an LED strip along the plinth and a tall open-shelf column beside it. The tray ceiling carries a recessed cove light and ring pendants, while the kitchen run in cream and tangerine sits on a stone-look backsplash, so the two zones read as one room.",
    materials: ["Fluted timber panelling", "LED plinth lighting", "Cream and tangerine laminate shutters", "Stone-look backsplash", "Tray ceiling with cove light"],
    scope: [
      "Fluted timber media wall with concealed LED strip",
      "Open-shelf display column with framed side panel",
      "Tray false ceiling with recessed cove and ring pendants",
      "Modular kitchen with chimney, hob and built-in oven",
      "Open-plan layout linking living, dining and kitchen",
    ],
  },
  {
    id: "living-kitchen-white",
    title: "Soft White Open-Plan Living & Kitchen",
    room: "Living Room",
    img: livingKitchenWhite,
    summary: "Marble-look TV panel with backlit edge, fluted cream walls and a handle-less white kitchen.",
    detail:
      "A bright, calm open-plan interior built around a marble-look television panel with a backlit edge, set into fluted cream wall cladding. Corner shelves, a gallery of framed prints and a carved textured wall panel add layers without clutter. A tray ceiling with a cove light, a crystal chandelier and a ceiling fan light the room, and the white handle-less kitchen runs on from the living area.",
    materials: ["Marble-look wall panel", "Fluted cream cladding", "Textured relief wall panel", "White handle-less shutters", "Crystal chandelier"],
    scope: [
      "Marble-look TV wall with backlit perimeter",
      "Fluted cream wall cladding with corner display shelves",
      "Tray false ceiling with cove lighting and chandelier point",
      "Handle-less white modular kitchen with chimney and hob",
      "Textured relief feature wall and framed art wall",
    ],
  },
  {
    id: "living-tv-marble",
    title: "Backlit Marble Media Wall",
    room: "Living Room",
    img: livingTvMarble,
    summary: "Book-matched marble TV wall framed in warm cove lighting and walnut reveals.",
    detail:
      "A full-height entertainment wall built around book-matched marble panels, recessed so the television sits flush rather than protruding. Warm LED cove lighting is layered in three planes — behind the marble, under the console and along the stepped false ceiling — so the wall becomes the room's light source after dark. The floating console is finished in high-gloss laminate over a black reveal, with concealed cable routing into the media niche.",
    materials: ["Book-matched marble", "Warm LED cove lighting", "Walnut veneer reveals", "High-gloss console", "Vitrified floor tiles"],
    scope: [
      "Stepped POP false ceiling with concealed cove lighting",
      "Book-matched marble cladding with backlit perimeter",
      "Floating media console with concealed cable management",
      "Recessed spotlights on a separate dimmable circuit",
      "Mirror-finish side panel to widen the room visually",
    ],
  },
  {
    id: "living-tv-walnut",
    title: "Fluted Walnut & Gold-Vein Feature Wall",
    room: "Living Room",
    img: livingTvWalnut,
    summary: "Gold-veined marble centrepiece flanked by fluted walnut columns and LED reveals.",
    detail:
      "A symmetrical living-room feature wall: a gold-veined marble centre panel bracketed by fluted walnut columns, each separated by a slim vertical LED reveal that grazes the flutes and exaggerates their depth. The floating console pairs a marble top with a dark shadow-gap plinth so it appears to hover clear of the floor. A sculptural ring pendant anchors the seating axis.",
    materials: ["Gold-vein marble", "Fluted walnut panelling", "Vertical LED reveals", "Marble-top console", "Textured wallpaper"],
    scope: [
      "Fluted walnut column panelling, grain matched across joints",
      "Gold-vein marble centre panel, dry-fixed for serviceability",
      "Vertical LED reveals between column and panel",
      "Cantilevered console with shadow-gap detail",
      "Coordinated textured wallpaper on the return walls",
    ],
  },
  {
    id: "master-bedroom",
    title: "Marble & Rose-Gold Master Suite",
    room: "Bedroom",
    img: masterBedroom,
    summary: "Marble-finish wardrobe with rose-gold inlay against an upholstered headboard wall.",
    detail:
      "A master bedroom organised around two opposing planes. One is a full-height marble-finish wardrobe run with rose-gold inlay strips and integrated loft storage; the other is an upholstered headboard wall in deep maroon, framed by fluted beige panelling and backlit at the centre. Exposed timber rafters break up the ceiling plane, and floating bedside consoles keep the floor clear so the room reads larger.",
    materials: ["Marble-finish laminate", "Rose-gold inlay", "Upholstered panelling", "Fluted beige panels", "Timber ceiling rafters"],
    scope: [
      "Full-height wardrobe with loft storage and soft-close hardware",
      "Upholstered headboard wall with concealed backlighting",
      "Floating bedside consoles with integrated sockets",
      "Decorative timber rafters over a plain plaster ceiling",
      "Two-way switching for bedside lamp control",
    ],
  },
  {
    id: "bedroom-blush",
    title: "Blush & Rose-Gold Bedroom",
    room: "Bedroom",
    img: bedroomBlush,
    summary: "Tufted headboard, blush wardrobe run and a backlit classical wall composition.",
    detail:
      "A softer, more classical bedroom in a blush and rose-gold palette. The bed wall is composed as three backlit recessed panels with moulded trim, drawing the eye to a buttoned and tufted headboard. The wardrobe run opposite is finished in matte blush with slim rose-gold pulls and arched light washes. A layered ceiling with a gold-striped border frames a crystal chandelier over the bed axis.",
    materials: ["Tufted upholstery", "Rose-gold hardware", "Floral textured wallpaper", "Crystal chandelier", "Marble flooring"],
    scope: [
      "Recessed bed-wall panelling with concealed LED backlighting",
      "Buttoned and tufted headboard, made to measure",
      "Matte-finish wardrobe run with rose-gold profile handles",
      "Layered false ceiling with gold-striped border detail",
      "Chandelier point with reinforced ceiling anchor",
    ],
  },
  {
    id: "kitchen-gloss",
    title: "Handleless High-Gloss Kitchen",
    room: "Kitchen",
    img: kitchenGloss,
    summary: "Handleless gloss cabinetry, veined marble backsplash and layered task lighting.",
    detail:
      "A galley kitchen built for a clean horizontal read: handleless high-gloss shutters with continuous J-groove pulls, an uninterrupted veined marble backsplash and a matching stone worktop. Glass-fronted wall units with blackened frames and internal lighting break the run of solid cabinetry. Under-cabinet LED strips light the worktop directly rather than relying on ceiling spots, so no one works in their own shadow.",
    materials: ["High-gloss acrylic shutters", "Veined marble worktop", "Blackened glass units", "Under-cabinet LED", "Quartz backsplash"],
    scope: [
      "Handleless modular cabinetry with J-groove profile",
      "Full-height marble backsplash, single slab where possible",
      "Glass-fronted display units with internal lighting",
      "Under-cabinet task lighting on a dedicated switch",
      "Soft-close drawers with cutlery and utensil organisers",
    ],
  },
  {
    id: "kitchen-l-shaped",
    title: "L-Shaped Kitchen with Crockery Unit",
    room: "Kitchen",
    img: kitchenLShaped,
    summary: "Efficient L-shaped work triangle with a full-height glazed crockery display.",
    detail:
      "An L-shaped modular kitchen planned around a tight work triangle — sink under the window, hob on the return, tall units housing the oven and refrigerator. A full-height glazed crockery unit in warm oak closes the run and doubles as display storage. Open oak niches above the counter break up the wall cabinetry, and the window is left clear at the sink for daylight and cross-ventilation.",
    materials: ["Oak-finish shutters", "Marble-effect counter", "Glazed crockery unit", "Open oak niches", "Geometric wallpaper"],
    scope: [
      "L-shaped modular layout planned to the work-triangle rule",
      "Full-height glazed crockery unit with internal lighting",
      "Built-in oven and chimney with concealed ducting",
      "Open display niches in oak veneer",
      "Granite-backed sink run positioned under the window",
    ],
  },
  {
    id: "pooja-room",
    title: "Backlit Pooja Room",
    room: "Pooja Room",
    img: poojaRoom,
    summary: "Teak mandir console with a backlit feather motif and framed deity niches.",
    detail:
      "A dedicated pooja room treated with the same care as the living spaces. The idol sits in a recessed alcove against a backlit feather motif cut from a solid panel and lit softly from behind, so the silhouette glows with no visible source. A teak console spans the wall with concealed drawer storage for pooja articles, stepped forward at the centre to give the idol prominence. Symmetrical floating shelves carry framed deities, flanked by hanging lanterns on blackened chains.",
    materials: ["Teak veneer console", "Backlit acrylic motif", "Damask wallpaper", "Crystal chandelier", "Brass lanterns"],
    scope: [
      "Recessed alcove with concealed backlit motif panel",
      "Teak console with soft-close drawers for pooja articles",
      "Symmetrical floating shelves for framed deities",
      "Hanging lantern points on blackened chain suspensions",
      "Dedicated lighting circuit with warm-white dimming",
    ],
  },
]
