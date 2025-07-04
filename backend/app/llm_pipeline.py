# from transformers import AutoTokenizer, AutoModelForSeq2SeqLM, pipeline
# from langchain_huggingface.llms import HuggingFacePipeline

# model_name = "VietAI/vit5-large-vietnews-summarization"
# tokenizer = AutoTokenizer.from_pretrained(model_name)
# model = AutoModelForSeq2SeqLM.from_pretrained(model_name)

# pipe = pipeline("text2text-generation", model=model, tokenizer=tokenizer, max_new_tokens=256, do_sample=False)
# llm = HuggingFacePipeline(pipeline=pipe)

from langchain_community.llms import LlamaCpp
import os

llm = LlamaCpp(
    model_path=os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "models", "Vi-Qwen2-1.5B-RAG-Q4_K_M.gguf")),
    temperature=0.2,
    top_p=0.95,
    max_tokens=256,
    n_ctx=2048,
    verbose=True
)