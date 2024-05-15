import{_ as n,p as s,q as a,Y as e}from"./framework-e1bed10d.js";const t={},p=e(`<h1 id="腾讯云短信服务接入" tabindex="-1"><a class="header-anchor" href="#腾讯云短信服务接入" aria-hidden="true">#</a> 腾讯云短信服务接入</h1><blockquote><p>ps: node版本 至少要7以上 申请短信服务的 SecretID 和 SecretKey</p></blockquote><h2 id="安装依赖" tabindex="-1"><a class="header-anchor" href="#安装依赖" aria-hidden="true">#</a> 安装依赖</h2><ul><li>npm i tencentcloud-sdk-nodejs</li></ul><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>
<span class="token keyword">const</span> tencentcloud <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">&quot;tencentcloud-sdk-nodejs&quot;</span><span class="token punctuation">)</span>

<span class="token comment">// 导入对应产品模块的client models。</span>
<span class="token keyword">const</span> smsClient <span class="token operator">=</span> tencentcloud<span class="token punctuation">.</span>sms<span class="token punctuation">.</span>v20210111<span class="token punctuation">.</span>Client

<span class="token comment">/* 实例化要请求产品(以sms为例)的client对象 */</span>
<span class="token keyword">const</span> client <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">smsClient</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
  <span class="token literal-property property">credential</span><span class="token operator">:</span> <span class="token punctuation">{</span>
  <span class="token comment">/* 必填：腾讯云账户密钥对secretId，secretKey。
   * 这里采用的是从环境变量读取的方式，需要在环境变量中先设置这两个值。
   * 您也可以直接在代码中写死密钥对，但是小心不要将代码复制、上传或者分享给他人，
   * 以免泄露密钥对危及您的财产安全。
   * SecretId、SecretKey 查询: https://console.cloud.tencent.com/cam/capi */</span>
    <span class="token literal-property property">secretId</span><span class="token operator">:</span> process<span class="token punctuation">.</span>env<span class="token punctuation">.</span>secretId<span class="token punctuation">,</span>
    <span class="token literal-property property">secretKey</span><span class="token operator">:</span> process<span class="token punctuation">.</span>env<span class="token punctuation">.</span>secretKey<span class="token punctuation">,</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token comment">/* 必填：地域信息，可以直接填写字符串ap-guangzhou，支持的地域列表参考 https://cloud.tencent.com/document/api/382/52071#.E5.9C.B0.E5.9F.9F.E5.88.97.E8.A1.A8 */</span>
  <span class="token literal-property property">region</span><span class="token operator">:</span> <span class="token string">&quot;ap-guangzhou&quot;</span><span class="token punctuation">,</span>
  <span class="token comment">/* 非必填:
   * 客户端配置对象，可以指定超时时间等配置 */</span>
  <span class="token literal-property property">profile</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token comment">/* SDK默认用TC3-HMAC-SHA256进行签名，非必要请不要修改这个字段 */</span>
    <span class="token literal-property property">signMethod</span><span class="token operator">:</span> <span class="token string">&quot;HmacSHA256&quot;</span><span class="token punctuation">,</span>
    <span class="token literal-property property">httpProfile</span><span class="token operator">:</span> <span class="token punctuation">{</span>
      <span class="token comment">/* SDK默认使用POST方法。
       * 如果您一定要使用GET方法，可以在这里设置。GET方法无法处理一些较大的请求 */</span>
      <span class="token literal-property property">reqMethod</span><span class="token operator">:</span> <span class="token string">&quot;POST&quot;</span><span class="token punctuation">,</span>
      <span class="token comment">/* SDK有默认的超时时间，非必要请不要进行调整
       * 如有需要请在代码中查阅以获取最新的默认值 */</span>
      <span class="token literal-property property">reqTimeout</span><span class="token operator">:</span> <span class="token number">30</span><span class="token punctuation">,</span>
      <span class="token doc-comment comment">/**
       * 指定接入地域域名，默认就近地域接入域名为 sms.tencentcloudapi.com ，也支持指定地域域名访问，例如广州地域的域名为 sms.ap-guangzhou.tencentcloudapi.com
       */</span>
      <span class="token literal-property property">endpoint</span><span class="token operator">:</span> <span class="token string">&quot;sms.tencentcloudapi.com&quot;</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span>

<span class="token comment">/* 请求参数，根据调用的接口和实际情况，可以进一步设置请求参数
 * 属性可能是基本类型，也可能引用了另一个数据结构
 * 推荐使用IDE进行开发，可以方便的跳转查阅各个接口和数据结构的文档说明 */</span>

<span class="token comment">/* 帮助链接：
 * 短信控制台: https://console.cloud.tencent.com/smsv2
 * 腾讯云短信小助手: https://cloud.tencent.com/document/product/382/3773#.E6.8A.80.E6.9C.AF.E4.BA.A4.E6.B5.81 */</span>
<span class="token keyword">const</span> params <span class="token operator">=</span> <span class="token punctuation">{</span>
  <span class="token literal-property property">SmsSdkAppId</span><span class="token operator">:</span> <span class="token string">&quot;1400787878&quot;</span><span class="token punctuation">,</span>
  <span class="token literal-property property">SignName</span><span class="token operator">:</span> <span class="token string">&quot;腾讯云&quot;</span><span class="token punctuation">,</span>
  <span class="token literal-property property">TemplateId</span><span class="token operator">:</span> <span class="token string">&quot;449739&quot;</span><span class="token punctuation">,</span>
  <span class="token literal-property property">TemplateParamSet</span><span class="token operator">:</span> <span class="token punctuation">[</span><span class="token string">&quot;1234&quot;</span><span class="token punctuation">]</span><span class="token punctuation">,</span>
  <span class="token literal-property property">PhoneNumberSet</span><span class="token operator">:</span> <span class="token punctuation">[</span><span class="token string">&quot;+8613711112222&quot;</span><span class="token punctuation">]</span><span class="token punctuation">,</span>
  <span class="token literal-property property">SessionContext</span><span class="token operator">:</span> <span class="token string">&quot;&quot;</span><span class="token punctuation">,</span>
  <span class="token literal-property property">ExtendCode</span><span class="token operator">:</span> <span class="token string">&quot;&quot;</span><span class="token punctuation">,</span>
<span class="token punctuation">}</span>
client<span class="token punctuation">.</span><span class="token function">SendSms</span><span class="token punctuation">(</span>params<span class="token punctuation">,</span> <span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token parameter">err<span class="token punctuation">,</span> response</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token comment">// 请求异常返回，打印异常信息</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span>err<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span>err<span class="token punctuation">)</span>
    <span class="token keyword">return</span>
  <span class="token punctuation">}</span>
  <span class="token comment">// 请求正常返回，打印response对象</span>
  console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span>response<span class="token punctuation">)</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span>

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,5),o=[p];function c(l,i){return s(),a("div",null,o)}const u=n(t,[["render",c],["__file","short-message.html.vue"]]);export{u as default};
