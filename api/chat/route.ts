import { NextRequest, NextResponse } from 'next/server';

// 指定运行环境为 Edge Function
export const runtime = 'edge';

// 处理 POST 请求（转发到 Coze 接口）
export async function POST(req: NextRequest) {
  try {
    // 获取前端传递的请求体
    const body = await req.json();
    
    // 你的 Coze 接口配置（已填好你的信息）
    const cozeApiUrl = "https://h69n9wp3wm.coze.site/stream_run";
    const authToken = "Bearer pat_nV10Tg01CNGC0cgBMIsz59uUkyubYx6QqydZ47K4ZdxbN8vD6NMkz1pCLc7S8eRw";

    // 转发请求到 Coze 接口
    const response = await fetch(cozeApiUrl, {
      method: 'POST',
      headers: {
        'Authorization': authToken,
        'Content-Type': 'application/json',
        'Accept': 'text/event-stream'
      },
      body: JSON.stringify(body),
      cache: 'no-cache'
    });

    // 返回响应给前端，同时设置跨域头
    return new NextResponse(response.body, {
      status: response.status,
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Access-Control-Allow-Origin': '*', // 允许所有域名访问
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
      }
    });
  } catch (error) {
    // 错误处理
    return new NextResponse(JSON.stringify({ error: '代理请求失败' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
}

// 处理浏览器预检请求（OPTIONS），解决跨域
export async function OPTIONS() {
  return new NextResponse(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400' // 预检请求缓存1天
    }
  });
}
