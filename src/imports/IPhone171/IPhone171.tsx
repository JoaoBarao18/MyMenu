import imgRectangle1 from "./LogoMyMenu.png";
function Frame() {
  return (
    <div className="absolute content-stretch flex flex-col h-[180px] items-center justify-center left-[95px] p-[10px] top-[71px] w-[248px]">
      <div className="h-[144px] relative shrink-0 w-[302px]">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgRectangle1} />
      </div>
    </div>
  );
}

function Frame1() {
  return (
    <div className="-translate-x-1/2 absolute bg-white border-5 border-[#4c1f03] border-solid bottom-[93px] h-[530px] left-1/2 overflow-clip rounded-[27px] w-[368px]">
      <p className="-translate-x-1/2 absolute font-['Quicksand:Bold',sans-serif] font-bold leading-[normal] left-[calc(50%+0.5px)] text-[#4c1f03] text-[36px] text-center top-[7px] whitespace-nowrap">Iniciar Sessão</p>
      <div className="-translate-x-1/2 absolute bg-[#f60] content-stretch flex h-[50px] items-center justify-between left-1/2 overflow-clip p-[10px] rounded-[47px] top-[349px] w-[270px]" data-name="Botao Iniciar Sessao">
        <p className="font-['Gruppo:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[36px] text-white whitespace-nowrap">Iniciar</p>
      </div>
    </div>
  );
}

function Frame2() {
  return (
    <div className="absolute content-stretch flex items-center justify-center left-[2px] p-[10px] top-[838px]">
      <p className="font-['Inter:Extra_Light_Italic',sans-serif] font-extralight italic leading-[normal] relative shrink-0 text-[#4c1f03] text-[13px] whitespace-nowrap">© 2026 MyMenu. Todos os direitos reservador. Termos de uso</p>
    </div>
  );
}

export default function IPhone() {
  return (
    <div className="bg-gradient-to-b from-[#fec356] relative size-full to-[#fffbed]" data-name="iPhone 17 - 1">
      <Frame />
      <Frame1 />
      <Frame2 />
    </div>
  );
}