import { NextRequest, NextResponse } from 'next/server'
import { LLMChain } from 'langchain/chains'
import { ChatOpenAI } from 'langchain/chat_models/openai'
import {
  SystemMessagePromptTemplate,
  HumanMessagePromptTemplate,
  ChatPromptTemplate,
} from 'langchain/prompts'

// import { SerpAPI } from "langchain/tools"
// import { Calculator } from "langchain/tools/calculator"

export async function POST(req: NextRequest) {
  try {
    // 目的とタスクを取得
    const { objective, task } = await req.json()

    // OpenAIのモデル
    const chat = new ChatOpenAI({
      openAIApiKey: process.env.OPENAI_API_KEY,
      modelName: 'gpt-3.5-turbo',
      temperature: 0.7,
    })

    // ツール
    // ネットから最新情報を取得したり、計算したりするツールを追加できます
    // https://js.langchain.com/docs/getting-started/guide-llm#agents-dynamically-run-chains-based-on-user-input
    // const tools = [
    //   new SerpAPI(process.env.SERPAPI_API_KEY, {
    //     location: 'Japan',
    //     hl: 'ja',
    //     gl: 'jp',
    //   }),
    //   new Calculator(),
    // ]

    // プロンプト
    const chatPrompt = ChatPromptTemplate.fromPromptMessages([
      SystemMessagePromptTemplate.fromTemplate(
        'You are an AI who performs one task based on the following objective: {objective}. Please answer in Japanese.'
      ),
      HumanMessagePromptTemplate.fromTemplate('Your task: {task}. Response:'),
    ])

    // LLMChain
    const chain = new LLMChain({ llm: chat, prompt: chatPrompt })

    // 実行
    const response = await chain.call({ objective, task })

    return NextResponse.json({ response: response.text })
  } catch (error) {
    console.log('error', error)
    return NextResponse.error()
  }
}
