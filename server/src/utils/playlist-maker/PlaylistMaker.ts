import { CuratePlaylist } from './CuratePlaylist';

import type { CookedTopics } from '../../types/cookedcourse';

export class PlaylistMaker extends CuratePlaylist {
    constructor(topics: CookedTopics, subject: string) {
        super(topics, subject)
        console.log(topics)
    }
}