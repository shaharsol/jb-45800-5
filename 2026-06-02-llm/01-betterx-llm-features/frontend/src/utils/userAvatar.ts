import alicePic from '../assets/alice.jpg'
import bobPic from '../assets/bob.jpg'
import charliePic from '../assets/charlie.jpg'
import gustavPic from '../assets/gustav.jpg'
import dianaPic from '../assets/Diana.jpg'

const AVATARS: Record<string, string> = {
    alice: alicePic,
    bob: bobPic,
    charlie: charliePic,
    gustav: gustavPic,
    diana: dianaPic,
}

const DEFAULT_AVATAR = alicePic

function normalizeKey(value?: string): string {
    return (value ?? '').toLowerCase().replace(/[^a-z]/g, '')
}

export function getUserAvatar(nameOrUsername?: string): string {
    const key = normalizeKey(nameOrUsername)
    if (!key) {
        return DEFAULT_AVATAR
    }

    for (const [userKey, src] of Object.entries(AVATARS)) {
        if (key.includes(userKey)) {
            return src
        }
    }

    return DEFAULT_AVATAR
}
