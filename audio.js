(function(){
  let ctx,master,enabled=false,volume=.4,ambient=[];
  function init(){if(ctx)return;try{ctx=new (window.AudioContext||window.webkitAudioContext)();master=ctx.createGain();master.gain.value=0;master.connect(ctx.destination);[65.4,98,130.8].forEach((f,i)=>{const o=ctx.createOscillator(),g=ctx.createGain();o.type='sine';o.frequency.value=f;g.gain.value=.025/(i+1);o.connect(g).connect(master);o.start();ambient.push(o);});}catch(e){enabled=false;}}
  function set(v){enabled=v;if(v){init();ctx?.resume();}if(master)master.gain.setTargetAtTime(v?volume:0,ctx.currentTime,.3);return enabled;}
  function tone(f,d=.7,gain=.25,type='sine',delay=0){if(!enabled||!ctx)return;const o=ctx.createOscillator(),g=ctx.createGain();o.type=type;o.frequency.setValueAtTime(f,ctx.currentTime+delay);g.gain.setValueAtTime(0,ctx.currentTime);g.gain.setValueAtTime(gain,ctx.currentTime+delay);g.gain.exponentialRampToValueAtTime(.0001,ctx.currentTime+delay+d);o.connect(g).connect(master);o.start(ctx.currentTime+delay);o.stop(ctx.currentTime+delay+d+.03);}
  function knock(){tone(420,.35,.25,'sine');tone(1134,.15,.075,'triangle');tone(180,.5,.15);}
  function chime(){tone(523.25,1,.08);tone(783.99,1.4,.055,'sine',.12);tone(1046.5,1.9,.04,'sine',.24);}
  function fracture(){if(!enabled||!ctx)return;let b=ctx.createBuffer(1,ctx.sampleRate*.35,ctx.sampleRate),d=b.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=(Math.random()*2-1)*Math.pow(1-i/d.length,3);let n=ctx.createBufferSource(),g=ctx.createGain(),f=ctx.createBiquadFilter();f.type='lowpass';f.frequency.value=700;g.gain.value=.24;n.buffer=b;n.connect(f).connect(g).connect(master);n.start();}
  window.Sound={set,toggle(){return set(!enabled)},get enabled(){return enabled},setVolume(v){volume=v;if(master)master.gain.setTargetAtTime(enabled?v:0,ctx.currentTime,.15);},get volume(){return volume},knock,chime,fracture,echo(){[.25,.65,1.05].forEach(d=>tone(370,.4,.07,'sine',d));}};
})();
