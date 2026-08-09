const systems=[
 [`minimalProfessional`,`Minimal Professional`,`Professional`,`#099999`,`#ffffff`,`#172023`,`clean`],
 [`boldTypography`,`Bold Typography`,`Bold`,`#ff5a36`,`#fff6ed`,`#16130f`,`bold`],
 [`executive`,`Executive`,`Professional`,`#1b4260`,`#f2f5f7`,`#15242f`,`executive`],
 [`dataAnalyst`,`Data Analyst`,`Data`,`#2563eb`,`#eef4ff`,`#10213c`,`data`],
 [`darkPremium`,`Dark Premium`,`Premium`,`#18b7a0`,`#101b1d`,`#f4fbfa`,`premium`],
 [`editorialMagazine`,`Editorial Magazine`,`Editorial`,`#c94736`,`#f5efe5`,`#251d18`,`editorial`],
 [`modernGradient`,`Modern Gradient`,`Modern`,`#7456ff`,`#f4f1ff`,`#211950`,`gradient`],
 [`storytelling`,`Storytelling`,`Story`,`#b76c43`,`#fbf3ea`,`#3c261b`,`story`],
 [`educational`,`Educational`,`Education`,`#168a6a`,`#effaf5`,`#19362d`,`cards`],
 [`checklist`,`Checklist`,`Education`,`#0a8799`,`#edf9fb`,`#17373c`,`checklist`],
 [`stepByStep`,`Step-by-Step`,`Process`,`#ec7b24`,`#fff5ea`,`#422612`,`steps`],
 [`mythFact`,`Myth vs Fact`,`Comparison`,`#d34c5c`,`#fff3f5`,`#3d1820`,`split`],
 [`beforeAfter`,`Before / After`,`Comparison`,`#6558d3`,`#f2f0ff`,`#211d48`,`split`],
 [`problemSolution`,`Problem → Solution`,`Strategy`,`#148578`,`#eff9f7`,`#173833`,`split`],
 [`caseStudy`,`Case Study`,`Business`,`#315b7b`,`#f1f5f8`,`#182b3a`,`case`],
 [`statistics`,`Statistics / Numbers`,`Data`,`#8a4bc2`,`#f7f0fd`,`#29153a`,`stat`],
 [`personalStory`,`Personal Story`,`Story`,`#c46c52`,`#fff4ef`,`#42241c`,`portrait`],
 [`thoughtLeadership`,`Quote / Thought Leadership`,`Editorial`,`#202020`,`#f6f3ec`,`#202020`,`quote`],
 [`framework`,`Framework`,`Strategy`,`#126f9a`,`#eef8fc`,`#123241`,`framework`],
 [`infographic`,`Infographic`,`Data`,`#047b70`,`#ecf8f5`,`#143b37`,`infographic`]
];
export const templates=Object.fromEntries(systems.map(([id,name,category,primary,background,text,style],i)=>[id,{id,name,category,style,palettes:{Default:{primary,secondary:text,accent:i%2?`#efab46`:`#36b7ad`,background,surface:`#ffffff`,text,muted:`#667579`},Dark:{primary,secondary:`#dcefee`,accent:`#efab46`,background:`#102326`,surface:`#183336`,text:`#f7fbfb`,muted:`#a9bcbc`},Monochrome:{primary:`#353b3c`,secondary:`#666f71`,accent:`#a7afb0`,background:`#f5f6f6`,surface:`#ffffff`,text:`#171a1b`,muted:`#70787a`}},typography:{heading:i%3===1?`Manrope`:`Inter`,body:`Inter`},geometry:{radius:[0,10,22][i%3],ornament:i%5},layouts:{hook:`cover`,intro:`content`,mistake:`content`,step:`steps`,statistic:`statistics`,comparison:`comparison`,framework:`framework`,chart:`chart`,summary:`summary`,cta:`cta`}}]));

