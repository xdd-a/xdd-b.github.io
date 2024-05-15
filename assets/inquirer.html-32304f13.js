import{_ as n,p as s,q as a,Y as e}from"./framework-e1bed10d.js";const p={},o=e(`<h1 id="inquirer-交互式命令" tabindex="-1"><a class="header-anchor" href="#inquirer-交互式命令" aria-hidden="true">#</a> inquirer 交互式命令</h1><blockquote><p>基于node环境 如果要在ts环境使用，需要一并安装@types/inquirer, 并且现阶段的9版本的会有问题，建议安装8.2.0 <code>npm i inquirer@8.2.0</code></p></blockquote><ul><li>用法</li></ul><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">interface</span> <span class="token class-name">inquirerProps</span> <span class="token punctuation">{</span>
  <span class="token literal-property property">type</span><span class="token operator">:</span>number<span class="token operator">|</span>string<span class="token operator">|</span>list<span class="token operator">|</span>input<span class="token operator">|</span>confirm<span class="token operator">|</span>password
  <span class="token literal-property property">name</span><span class="token operator">:</span>string<span class="token comment">// 问句的变量，最终会将value给到 name:value</span>
  <span class="token literal-property property">message</span><span class="token operator">:</span>string <span class="token comment">// 问题内容</span>
  <span class="token keyword">default</span><span class="token operator">:</span>string<span class="token operator">|</span>number<span class="token operator">|</span>boolean<span class="token operator">|</span>array<span class="token operator">|</span><span class="token keyword">function</span> <span class="token comment">// 如果为function 他的value就是 配置的所有项的值</span>
  <span class="token function-variable function">validate</span><span class="token operator">:</span> <span class="token keyword">function</span> <span class="token comment">// 校验 参数为当前的value</span>
  <span class="token function-variable function">when</span><span class="token operator">:</span><span class="token keyword">function</span> <span class="token operator">|</span> boolean <span class="token comment">//可以根据前面的内容判断是否需要展示该问题</span>
  <span class="token literal-property property">choices</span><span class="token operator">:</span>array <span class="token operator">|</span> <span class="token keyword">function</span> <span class="token comment">// 列表的选择项 1 | 2</span>
<span class="token punctuation">}</span>



<span class="token keyword">import</span> inquirer <span class="token keyword">from</span> <span class="token string">&#39;inquirer&#39;</span>

<span class="token keyword">const</span> <span class="token literal-property property">config</span> <span class="token operator">:</span>inquirerProps<span class="token punctuation">[</span><span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token punctuation">[</span>
  <span class="token punctuation">{</span>
    <span class="token literal-property property">type</span><span class="token operator">:</span><span class="token string">&#39;list&#39;</span><span class="token punctuation">,</span>
    <span class="token literal-property property">name</span><span class="token operator">:</span><span class="token string">&#39;admin&#39;</span><span class="token punctuation">,</span>
    <span class="token literal-property property">message</span><span class="token operator">:</span><span class="token string">&#39;测试&#39;</span><span class="token punctuation">,</span>
    <span class="token keyword">default</span><span class="token operator">:</span><span class="token string">&#39;ad&#39;</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">]</span>
<span class="token keyword">const</span> a <span class="token operator">=</span> <span class="token keyword">await</span> inquirer<span class="token punctuation">.</span><span class="token function">prompt</span><span class="token punctuation">(</span>config<span class="token punctuation">)</span>

console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span>a<span class="token punctuation">)</span> <span class="token comment">// {admin: ad}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,4),t=[o];function r(i,l){return s(),a("div",null,t)}const u=n(p,[["render",r],["__file","inquirer.html.vue"]]);export{u as default};
