"use strict";(self.webpackChunkfrontend=self.webpackChunkfrontend||[]).push([[6247],{93336:e=>{function n(e){!function(e){e.languages.diff={coord:[/^(?:\*{3}|-{3}|\+{3}).*$/m,/^@@.*@@$/m,/^\d+.*$/m]};var n={"deleted-sign":"-","deleted-arrow":"<","inserted-sign":"+","inserted-arrow":">",unchanged:" ",diff:"!"};Object.keys(n).forEach((function(a){var s=n[a],f=[];/^\w+$/.test(a)||f.push(/\w+/.exec(a)[0]),"diff"===a&&f.push("bold"),e.languages.diff[a]={pattern:RegExp("^(?:["+s+"].*(?:\r\n?|\n|(?![\\s\\S])))+","m"),alias:f}})),Object.defineProperty(e.languages.diff,"PREFIXES",{value:n})}(e)}e.exports=n,n.displayName="diff",n.aliases=[]}}]);