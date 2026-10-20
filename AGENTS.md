<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Structure
- The homepage lives at `/` (no splash gateway). The TGN logo is shown as a prominent header banner and the landing hero uses a gradient, not a photograph.
- ServicePricing delegates home and business pricing to audience-aware HomePricing, which reuses request forms and omits household deduction for business; each feature owns its canonical source prices so service and legacy pricing pages agree.
- Business service content lives in business-service with its own four-language copy; shared partnership promises reuse home copy where identical to keep guarantees consistent.
- Language controls render bundled country-flag images rather than emoji, ensuring flags display consistently across platforms.
- The homepage's extended about copy uses structured translation fields separate from the shared service-page introduction, so homepage revisions do not unintentionally rewrite service pages.
- Homepage pricing-banner copy uses its own translated fields and links to the existing service pages, keeping the price tables and service-page introduction independent.
- News content uses multilingual JSON fields and private Storage images with signed public URLs only for published articles; database roles restrict all edits to verified administrators.
- News administrator roles are assigned by an Auth lifecycle trigger after the approved email is verified; no browser-controlled role assignment or first-user promotion is permitted.
- Homepage section backgrounds use semantic cream and neutral-grey tokens, with lavender reserved for the first banner, to maintain the requested alternation.
- Video booking uses a dedicated multilingual calendar-first feature on /varaa; submissions are validated and stored server-side in public.booking_requests (anon insert-only RLS, server-side publishable client). Do not claim confirmed bookings until scheduling is connected; owner email notification waits for a verified sender domain.
- Home contact and service-start requests share client/server Zod validation and server-side insertion into separate insert-only public tables; database triggers enforce per-email throttling without exposing private submissions.
