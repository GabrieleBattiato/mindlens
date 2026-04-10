from app.config import settings


class PromptBuilder:
    def __init__(self):
        self._cache: dict[str, str] = {}

    def _load_template(self, name: str) -> str:
        if name not in self._cache:
            path = settings.prompts_dir / name
            self._cache[name] = path.read_text()
        return self._cache[name]

    _LANG_LABELS = {"es": "Spanish (Latin American)", "en": "English"}

    def build_system_prompt(self, strict: bool = False, locale: str = "es") -> str:
        template = self._load_template(
            "analysis_system_strict.txt" if strict else "analysis_system.txt"
        )
        lang = self._LANG_LABELS.get(locale, "Spanish (Latin American)")
        return template.replace("{{LANGUAGE}}", lang)

    def build_user_prompt(
        self,
        mode: str,
        raw_input: str,
        situation: str | None = None,
        thoughts: str | None = None,
        emotions: str | None = None,
        intensity: int | None = None,
        behaviors: str | None = None,
    ) -> str:
        template = self._load_template("analysis_user.txt")
        if mode == "free":
            return template.replace("{{MODE}}", "free").replace(
                "{{CONTENT}}", f"--- BEGIN USER INPUT ---\n{raw_input}\n--- END USER INPUT ---"
            )
        content = f"""--- BEGIN USER INPUT ---
Situation: {situation}
Thoughts: {thoughts}
Emotions: {emotions}
Intensity: {intensity}/10
Behaviors: {behaviors or 'Not specified'}
--- END USER INPUT ---"""
        return template.replace("{{MODE}}", "guided").replace("{{CONTENT}}", content)


    def build_assist_system_prompt(self, step: str) -> str:
        if step == "disputation":
            return self._load_template("disputation_system.txt")
        return self._load_template("new_belief_system.txt")

    def build_assist_user_prompt(
        self,
        activating_event: str,
        belief: str,
        consequence: str,
        disputation: str | None = None,
    ) -> str:
        template = self._load_template("assist_user.txt")
        disputation_block = (
            f"D — Disputa del usuario:\n{disputation}" if disputation else ""
        )
        return (
            template
            .replace("{{ACTIVATING_EVENT}}", activating_event)
            .replace("{{BELIEF}}", belief)
            .replace("{{CONSEQUENCE}}", consequence)
            .replace("{{DISPUTATION_BLOCK}}", disputation_block)
        )


prompt_builder = PromptBuilder()
