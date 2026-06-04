# Submitting AI-generated pic with `createPost` (minimal changes plan)

## Current baseline (what already works)

- **Frontend**: `ProfileService.createPost(draft)` posts to `POST /profile` with `Content-Type: multipart/form-data` and includes `draft.image` (a `File` from `<input type="file" ...>`).
  - See `frontend/src/services/auth-aware/ProfileService.ts`.
- **Backend**: `POST /profile` validates body + validates `files.image` (optional) + uploads the file to S3 in `fileUploader` and stores the resulting `imageUrl` in the DB.
  - Route chain: `bodyValidation(newPostValidator) -> filesValidation(newPostFilesValidator) -> fileUploader -> createPost`
  - See `backend/src/routers/profile.ts`, `backend/src/middlewares/file-uploader.ts`, `backend/src/controllers/profile/controller.ts`.

That means the backend **already supports optional images**, as long as the request is `multipart/form-data` and includes a file field named **`image`**.

## Goal

When the user clicks **Generate Pic** (AI), allow them to submit the post using the **AI-generated image** as the `image` file in the existing `createPost` flow.

## Minimal backend changes (recommended: none)

- **No backend changes required** if frontend sends the AI image as an actual file in the existing `image` form field.
- The existing backend already:
  - Accepts `files.image` (optional)
  - Uploads it to S3
  - Persists `imageUrl`

### Only edge-case backend change (optional, if you want to support base64 directly)

If you later decide you *don’t* want to convert base64 → `File` in the browser, then you’d add support for a `body.imageBase64` field (or similar) and convert it server-side. This is **not minimal** and also duplicates upload logic, so I wouldn’t start there.

## Minimal frontend changes (recommended approach)

### 1) Convert the AI base64 response into a `File`

Right now `POST /drafts/pic` returns:

```json
{ "base64": "..." }
```

In the UI, you already set `previewImage` to a data URL:

- `data:image/png;base64,${base64}`

To reuse the existing `createPost` upload path, you need to **turn that base64 into a `File`** and then attach it to the `draft.image` field before calling `profileService.createPost(draft)`.

Practical browser-side conversion (conceptual steps):

- Build a data URL: `data:image/png;base64,<base64>`
- `fetch(dataUrl)` to get a `Blob`
- `new File([blob], "ai.png", { type: "image/png" })`

### 2) Store the AI-generated `File` in component state

Add a new state, e.g.:

- `const [aiImageFile, setAiImageFile] = useState<File | null>(null)`

When `generatePic` returns base64:

- Create the `File`
- `setAiImageFile(file)`
- Also set `previewImage` (so the user sees it immediately)

### 3) Update `createPost` to prefer the AI `File` when present

Right now `createPost(draft)` does:

- `draft.image = (draft.image as unknown as FileList)[0]`

Minimal change:

- If `aiImageFile` exists, set `draft.image = aiImageFile`
- Else keep current behavior (use file input selection)

This preserves existing UX (user can still upload their own file), but enables AI image submission with **no backend changes**.

### 4) (Optional) Clear AI image after successful submit

After `reset()` / successful post:

- `setAiImageFile(null)`
- `setPreviewImage('')` (or keep whatever you prefer)

## Validation implications

- Backend currently validates mimetype: `image/jpeg` or `image/png`.
- Your AI pic flow is using `data:image/png;base64,...`, so the generated `File` should have:
  - `type: "image/png"`
  - filename `*.png`

That should pass `newPostFilesValidator` unchanged.

## Summary (smallest possible change list)

- **Backend**: no changes.
- **Frontend**:
  - Convert `{ base64 }` → `File("ai.png", { type: "image/png" })`
  - Store it in state
  - In `createPost`, use that `File` as `draft.image` (so existing multipart upload works)

